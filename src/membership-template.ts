import { BigInt } from "@graphprotocol/graph-ts"
import {
  MembershipTemplate,
  DeployDao,
  DeployToken,
  InstalledApp
} from "../generated/MembershipTemplate/MembershipTemplate"
import { Token, Voting, User } from "../generated/schema";
import { createNewDao, createToken } from "./helper";

export function handleDeployDao(event: DeployDao): void {
  /**
   * Create new instance of MembershipDAO if not already created :
   *    - call `createNewDao` method from helper function.
   */

}

export function handleDeployToken(event: DeployToken): void {
  /**
   * Store the token created by the DAO : 
   *    - call `createNewDao` method from helper function.
   *    - call `createToken` method from helper function.
   * 
   * Mark token address for tracking using `Token` template.
   */
}

export function handleInstalledApp(event: InstalledApp): void {

  /**
   * Voting APP hash id is `0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4`
   * Whenever event param's appId has above matching value, Voting applicatoin is enabled for the DAO.
   * So, we would track Voting proxy contract generated through Deploy DAO transaction.
   * Voting proxy would handle new proposal creation, voting and execution of the proposal.
   * 
   * Create `Voting` instance.
   * Start tracking of created `Voting` contract address using `Voting` template. 
   */

}

export function handleDAOTokenTransfer(): void {
  /**
   * 
   * Create new `User` instance with user address and DAO as unique identifier.
   * Load `MembershipDAO` using event's address.
   * 
   *  - When DAO creator transfers tokens to User, `from` param is event is ZERO address.
   * So whenever this handler is called having `from` address as ZERO, then create User
   * instance.
   *  - Increments `totalHolders` value by `1` in MembershipDAO instance.
   * 
   */

}
