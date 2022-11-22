import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  MembershipTemplate,
  DeployDao,
  DeployToken,
  InstalledApp
} from "../generated/MembershipTemplate/MembershipTemplate";
import { Voting as VotingTemplate, Token as TokenTemplate } from "../generated/templates";
import { Token, Voting, User, TransactionInfo, MembershipDao } from "../generated/schema";
import { createNewDao, createToken } from "./helper";
import { BIG_INT_ONE, BIG_INT_ZERO, VOTING_APP_HASH_ID, ZERO_ADDRESS } from "./constants";
import { Transfer } from "../generated/templates/Token/Token";

export function handleDeployDao(event: DeployDao): void {
  /**
   * Create new instance of MembershipDao if not already created :
   *    - call `createNewDao` method from helper function.
   */

  createNewDao(event);

  const transaction = new TransactionInfo(event.transaction.hash.toHexString());
  transaction.dao = event.params.dao;
  transaction.voting = ZERO_ADDRESS;
  transaction.token = ZERO_ADDRESS;

  log.info('In handleDeployDao tx hash {}', [event.transaction.hash.toHexString()]);

  transaction.save();

}

export function handleDeployToken(event: DeployToken): void {
  /**
   * Store the token created by the DAO : 
   *    - call `createNewDao` method from helper function.
   *    - call `createToken` method from helper function.
   * 
   * Mark token address for tracking using `Token` template.
   */

  createToken(event.params.token);

  let transaction = TransactionInfo.load(event.transaction.hash.toHexString());

  if (transaction && transaction.dao !== null) {
    log.info('transaction dao {}', [transaction.dao.toHexString()]);
    let membershipDao = MembershipDao.load(transaction.dao.toHexString());
    if (membershipDao != null) {
      membershipDao.token = event.params.token;
      membershipDao.save();
    } else {
      log.info('in handleDeployToken {} ', [transaction.dao.toHexString()]);
      membershipDao = new MembershipDao(transaction.dao.toHexString());
      membershipDao.token = event.params.token;
      membershipDao.save();
    }
  } else {
    transaction = new TransactionInfo(event.transaction.hash.toHexString());
    transaction.token = event.params.token;
    transaction.dao = ZERO_ADDRESS;
    transaction.voting = ZERO_ADDRESS;
    transaction.save();
  }

  TokenTemplate.create(event.params.token);

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

  if (event.params.appId.equals(VOTING_APP_HASH_ID)) {
    const votingInstance = new Voting(event.params.appProxy.toHexString());
    votingInstance.currentVoteLength = BIG_INT_ZERO;
    votingInstance.creator = event.transaction.from;

    const transaction = TransactionInfo.load(event.transaction.hash.toHexString());

    if (transaction && transaction.dao !== null) {
      votingInstance.dao = transaction.dao;
      transaction.voting = event.params.appProxy;
      transaction.save();

      const membershipDao = MembershipDao.load(transaction.dao.toHexString());
      if (membershipDao != null) {
        membershipDao.voting = transaction.voting;
        membershipDao.save();
      }
    }

    votingInstance.save();
  }

  VotingTemplate.create(event.params.appProxy);

}

export function handleDAOTokenTransfer(event: Transfer): void {
  /**
   * 
   * Create new `User` instance with user address and DAO as unique identifier.
   * Load `MembershipDao` using event's address.
   * 
   *  - When DAO creator transfers tokens to User, `from` param is event is ZERO address.
   * So whenever this handler is called having `from` address as ZERO, then create User
   * instance.
   *  - Increments `totalHolders` value by `1` in MembershipDao instance.
   */
  const transaction = TransactionInfo.load(event.transaction.hash.toHexString());
  if (event.params.from.equals(ZERO_ADDRESS)) {
    if (transaction) {
      const membershipDaoInstance = MembershipDao.load(transaction.dao.toHexString());
      if (membershipDaoInstance != null) {
        membershipDaoInstance.totalHolders = membershipDaoInstance.totalHolders.plus(BIG_INT_ONE);
        membershipDaoInstance.token = transaction.token;
        membershipDaoInstance.save();
      }
    }
    
    const userAddress = event.params.to.toHexString();
    if (transaction && transaction.dao) {
      const userId = userAddress + "-" + transaction.dao.toHexString();
      let userInstance = User.load(userId);
      if (userInstance == null && event.params.from == ZERO_ADDRESS) {
        userInstance = new User(userId);
        userInstance.dao = transaction.dao.toHexString();
        userInstance.userAddress = event.params.to;
        userInstance.save();
      }
    }
  }

}
