import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes, ethereum, Value } from "@graphprotocol/graph-ts"
import { MembershipDao, Token, Voting } from "../generated/schema"
import { DeployDao, DeployToken, InstalledApp } from "../generated/MembershipTemplate/MembershipTemplate"
import { handleDAOTokenTransfer, handleDeployDao, handleDeployToken, handleInstalledApp } from "../src/membership-template"
import { createDAOTokenTransfer, createDeployDaoEvent, createDeployTokenEvent, createInstalledAppEvent } from "./membership-template-utils"
import { Token as TokenContract } from "../generated/templates/Token/Token";
import { BIG_INT_ZERO, ZERO_ADDRESS } from "../src/constants"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

let newDeployTokenEvent: DeployToken;
let VOTING_APP_ID: Bytes;
let newInstalledAppEvent:InstalledApp;
let appProxy = Address.fromString("0x0000000000000000000000000000000000000006");
let dao = Address.fromString("0x0000000000000000000000000000000000000001")
describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newDeployDaoEvent = createDeployDaoEvent(dao)
    handleDeployDao(newDeployDaoEvent)

    let token = Address.fromString("0x0000000000000000000000000000000000000002")
    newDeployTokenEvent = createDeployTokenEvent(token);

  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MembershipDao created and stored", () => {
    assert.entityCount("MembershipDao", 1)


    const memDao = MembershipDao.load('0x0000000000000000000000000000000000000001');

    assert.fieldEquals(
      "MembershipDao",
      "0x0000000000000000000000000000000000000001",
      "totalHolders",
      "0",
    );

    assert.fieldEquals(
      "MembershipDao",
      "0x0000000000000000000000000000000000000001",
      "voting",
      "0x0000000000000000000000000000000000000000",
    );

    assert.fieldEquals(
      "MembershipDao",
      "0x0000000000000000000000000000000000000001",
      "creator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
    );

    assert.fieldEquals(
      "MembershipDao",
      "0x0000000000000000000000000000000000000001",
      "token",
      "0x0000000000000000000000000000000000000000",
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })

  test("Populate Token entity from DeployToken event", () => {
    let token = Address.fromString("0x0000000000000000000000000000000000000002")
    const name = "Test Token";
    const symbol = "TT";
    const decimals = 18;

    // mocking
    createMockedFunction(Address.fromString("0x0000000000000000000000000000000000000002"), "name", "name():(string)").returns([ethereum.Value.fromString(name)]);
    createMockedFunction(Address.fromString("0x0000000000000000000000000000000000000002"), "symbol", "symbol():(string)").returns([ethereum.Value.fromString(symbol)]);
    createMockedFunction(Address.fromString("0x0000000000000000000000000000000000000002"), "decimals", "decimals():(uint8)").returns([ethereum.Value.fromI32(decimals)]);

    handleDeployToken(newDeployTokenEvent);

    assert.entityCount("Token", 1)

    const tokenInstance = Token.load('0x0000000000000000000000000000000000000002');

    assert.assertNotNull(tokenInstance);

    assert.fieldEquals(
      "MembershipDao",
      "0x0000000000000000000000000000000000000001",
      "token",
      "0x0000000000000000000000000000000000000002",
    );

    assert.fieldEquals(
      "TransactionInfo",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "dao",
      "0x0000000000000000000000000000000000000001",
    );

    assert.fieldEquals(
      "TransactionInfo",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "voting",
      "0x0000000000000000000000000000000000000000",
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })

  test("Populate Voting entity from InstalledApp event", () => {

    VOTING_APP_ID = Bytes.fromHexString("0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4");
    newInstalledAppEvent = createInstalledAppEvent(appProxy, VOTING_APP_ID);
    handleInstalledApp(newInstalledAppEvent);

    assert.entityCount("Voting", 1);

    assert.fieldEquals(
      "MembershipDao",
      "0x0000000000000000000000000000000000000001",
      "voting",
      appProxy.toHexString(),
    );

    assert.fieldEquals(
      "Voting",
      appProxy.toHexString(),
      "creator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
    );

    assert.fieldEquals(
      "Voting",
      appProxy.toHexString(),
      "currentVoteLength",
      BIG_INT_ZERO.toString(),
    );
  })

  test("Do not Populate Voting entity from InstalledApp event if APP HASH ID is incorrect", () => {

    VOTING_APP_ID = Bytes.fromHexString("0x8fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4");
    const APP_PROXY = Address.fromString("0x0000000000000000000000000000000000000008");;
    newInstalledAppEvent = createInstalledAppEvent(APP_PROXY, VOTING_APP_ID);
    handleInstalledApp(newInstalledAppEvent);

    const votingInstance = Voting.load(APP_PROXY.toHexString());

    assert.assertNull(votingInstance);

  });

  test("Populate User entity from Transfer event", () => {

    const from = ZERO_ADDRESS;
    const to = Address.fromString("0x0000000000000000000000000000000000000006");
    const value = BigInt.fromI32(1);
    const newDAOTokenTransferEvent = createDAOTokenTransfer(from, to, value);

    handleDAOTokenTransfer(newDAOTokenTransferEvent);

    assert.entityCount('User', 1);

    const userId = to.toHexString() + "-" + dao.toHexString();
    assert.fieldEquals(
      "User",
      userId,
      "dao",
      dao.toHexString(),
    );

    assert.fieldEquals(
      "User",
      userId,
      "userAddress",
      to.toHexString(),
    );

  });
})
