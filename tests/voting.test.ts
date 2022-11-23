import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction
} from "matchstick-as/assembly/index"
import { Address, BigInt, ByteArray, Bytes, ethereum, Value } from "@graphprotocol/graph-ts"
import { MembershipDao, Token, Voting } from "../generated/schema"
import { StartVote, ExecuteVote, CastVote } from "../generated/templates/Voting/Voting";
import { handleNewVoteProposal, handleVoteCasted, handleVoteExecuted } from "../src/voting";
import { createCastVote, createStartVote, createExecuteVote } from "./voting-utils"
import { Token as TokenContract } from "../generated/templates/Token/Token";
import { BIG_INT_ZERO, ZERO_ADDRESS } from "../src/constants"

let voteId: BigInt;
let metadata: string;
let newStartVoteEvent: StartVote;
let newCastVoteEvent: CastVote;
let creator: Address = Address.fromString("0x0000000000000000000000000000000000000022");
describe("Describe entity assertions", () => {
  beforeAll(() => {
    voteId = BigInt.fromI32(1);
    metadata = "graphica";
    newStartVoteEvent = createStartVote(voteId, metadata, creator)

  })

  afterAll(() => {
    clearStore()
  })

  test("Voting entity created and stored", () => {

    // mocking
    createMockedFunction(Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a"), "getVote", "getVote(uint256):(bool,bool,uint64,uint64,uint64,uint64,uint256,uint256,uint256,bytes)").withArgs([ethereum.Value.fromUnsignedBigInt(voteId)]).returns(
      [
        ethereum.Value.fromBoolean(true),
        ethereum.Value.fromBoolean(true),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(4567)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(7894)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(5)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(7)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(100)),
        ethereum.Value.fromBytes(Bytes.fromHexString("0x0000000000000000000000000000000000000012"))
      ]
    );

    const voteIdentifier = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a" + "-" + voteId.toHexString();
    handleNewVoteProposal(newStartVoteEvent);
    assert.entityCount("Vote", 1);


    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "metadata",
      metadata,
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "totalYes",
      "0",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "quorumRequired",
      "10",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "executionScript",
      "0x0000000000000000000000000000000000000012",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "executed",
      "false",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "executionDate",
      "0",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "creator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "snapshotBlock",
      "4567",
    );

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "startDate",
      "1234",
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });

  test("Handle YES vote casted by user", () => {
    assert.entityCount("Vote", 1);
    const voter = Address.fromString("0x0000000000000000000000000000000000000042");
    const supports = true;
    const stake = BigInt.fromI32(0);
    const newCastVoteEvent = createCastVote(voteId, voter, supports, stake);

    handleVoteCasted(newCastVoteEvent);

    const voteIdentifier = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a" + "-" + voteId.toHexString();

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "totalYes",
      "1",
    );
  });

  test("Handle NAY vote casted by user", () => {
    assert.entityCount("Vote", 1);
    const voter = Address.fromString("0x0000000000000000000000000000000000000042");
    const supports = false;
    const stake = BigInt.fromI32(0);
    const newCastVoteEvent = createCastVote(voteId, voter, supports, stake);

    handleVoteCasted(newCastVoteEvent);

    const voteIdentifier = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a" + "-" + voteId.toHexString();

    assert.fieldEquals(
      "Vote",
      voteIdentifier.toString(),
      "totalNo",
      "1",
    );
  });
})
