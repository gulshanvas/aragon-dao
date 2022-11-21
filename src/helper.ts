import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  DeployDao,
} from "../generated/MembershipTemplate/MembershipTemplate"
import { MembershipDao, Token, Voting } from "../generated/schema";
import { BIG_INT_ZERO, ZERO_ADDRESS } from "./constants";
import { Token as TokenContract } from "../generated/templates/Token/Token";

// Accepts newly created DAO address
export function createNewDao(event: DeployDao): MembershipDao {
  /**
   * Creates `MembershipDao` instance if not already created.
   * Populates token, voting and creator fields.
   */
  let memberShipDao = MembershipDao.load(event.params.dao.toHexString());

  if (memberShipDao == null) {
    memberShipDao = new MembershipDao(event.params.dao.toHexString());
    memberShipDao.creator = event.transaction.from;
    memberShipDao.token = ZERO_ADDRESS;
    memberShipDao.voting = ZERO_ADDRESS;
    memberShipDao.totalHolders = BIG_INT_ZERO;
  }

  memberShipDao.save();

  return memberShipDao;
}

// Accepts token address
export function createToken(address: Address): Token {
  /**
   * Creates new `Token` instance for the input token address.
   * Creates ERC20 instance for token address and using on-chain call to instance methods,
   * populates name, symbol and decimals fields of Token instance.
   */

  const tokenInstance = new Token(address.toHexString());

  const tokenContractInstance = TokenContract.bind(address);

  tokenInstance.name = tokenContractInstance.try_name().value;
  tokenInstance.symbol = tokenContractInstance.try_symbol().value;
  tokenInstance.decimals = BigInt.fromI32(tokenContractInstance.try_decimals().value);

  tokenInstance.save();

  return tokenInstance;
}