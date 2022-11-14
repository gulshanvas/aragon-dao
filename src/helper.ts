import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MembershipTemplate,
  DeployDao,
  DeployToken,
  InstalledApp
} from "../generated/MembershipTemplate/MembershipTemplate"
import { Token, Voting } from "../generated/schema";

// Accepts newly created DAO address
export function createNewDao(address: Address) {
  /**
   * Creates `MembershipDAO` instance if not already created.
   * Populates token, voting and creator fields.
   */
}

// Accepts token address
export function createToken(address: Address) {
  /**
   * Creates new `Token` instance for the input token address.
   * Creates ERC20 instance for token address and using on-chain call to instance methods,
   * populates name, symbol and decimals fields of Token instance.
   */

}