import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  StartVote,
  CastVote,
  ExecuteVote
} from "../generated/templates/Voting/Voting"
import { Token, Voting, UserVote, Vote, User } from "../generated/schema";

import { Voting as VotingContract } from "../generated/templates/Voting/Voting";
import { BIG_INT_ONE, BIG_INT_ZERO } from "./constants";

export function handleNewVoteProposal(event: StartVote): void {
  /**
   * Loads Voting object based on the event address, updates total votes created till now.
   * `creator` field is available from event's param.
   * 
   * Creates new Vote instance using Voting address and Vote ID in event
   * Populates other fields of Vote by calling `getVote` view method passing Vote Id 
   * available in event param. 
   */
  const votingContractAddress = event.address;
  log.info('votingContractAddress {} ', [votingContractAddress.toHexString()]);
  const voteIdentifier = votingContractAddress.toHexString() + "-" + event.params.voteId.toHexString();
  const voteInstance = new Vote(voteIdentifier);

  const voteId = event.params.voteId;
  voteInstance.voteId = voteId;
  voteInstance.metadata = event.params.metadata;

  const voteContract = VotingContract.bind(votingContractAddress);
  const voteState = voteContract.getVote(voteId);

  voteInstance.startDate = voteState.getStartDate();
  voteInstance.snapshotBlock = voteState.getSnapshotBlock();
  voteInstance.quorumRequired = voteState.getMinAcceptQuorum();
  voteInstance.totalYes = BIG_INT_ZERO;
  voteInstance.totalNo = BIG_INT_ZERO;
  voteInstance.executionScript = voteState.getScript();
  voteInstance.executed = false;
  voteInstance.executionDate = BigInt.fromI32(0);
  voteInstance.creator = event.transaction.from;

  voteInstance.save();

}

export function handleVoteCasted(event: CastVote): void {
  /**
   * Loads Vote instance by using event's address and voteId param in event.
   *  - Based on `supports` value in event, update `totalYes` and `totalNo`.
   *    If `supports` is true, increment `totalYes` otherwise increment `totalNo`.
   *    `totalYes` and `totalNo` will be incremented if user has already voted.
   * 
   * Loads `Voting` instance, gets `dao` address
   * 
   * Creates/Loads UserVote object 
   *  - `id` is concatenation of User address, `dao` address and `voteId`.
   *    `voteId` and user's address if fetched from event's param.
   *  - `voted` is set to true.
   *  - `voteStatus` is set based on `supports` value in event's param.
   */

  const votingContractAddress = event.address;

  const voteIdentifier = votingContractAddress.toHexString() + "-" + event.params.voteId.toHexString();

  const voteInstance = Vote.load(voteIdentifier);

  if (voteInstance != null) {
    const supports = event.params.supports;
    if (supports) {
      voteInstance.totalYes = voteInstance.totalYes.plus(BIG_INT_ONE);
    } else {
      voteInstance.totalNo = voteInstance.totalNo.plus(BIG_INT_ONE);
    }

    const voteId = event.params.voteId;
    const votingInstance = Voting.load(votingContractAddress.toHexString());
    if (votingInstance != null) {
      votingInstance.currentVoteLength = votingInstance.currentVoteLength.plus(BIG_INT_ONE);
      const voter = event.params.voter;
      const userVoteId = voter.toHexString() + "-" + votingInstance.dao.toHexString() + "-" + voteId.toHexString();
      let userVote = UserVote.load(userVoteId);
      if ((userVote == null) && votingInstance.dao) {
        log.info('User with address {} has casted for voting contract address {} having vote id as {}', [voter.toHexString(), votingContractAddress.toHexString(), voteId.toHexString()]);
        userVote = new UserVote(userVoteId);
        userVote.dao = votingInstance.dao;
        userVote.voteId = voteId;
        userVote.voted = true;
        if (supports) {
          userVote.voteStatus = "1";
        } else {

          userVote.voteStatus = "2";
        }
        userVote.save();
      }
    }
    voteInstance.save();
  }

}

export function handleVoteExecuted(event: ExecuteVote): void {
  /**
   * Loads Vote instance using event's address.
   *  - Mark `executed` field as true.
   *  - Update `executionBlock` field from event's block object
   */
  const votingContractAddress = event.address;
  const votingInstance = Voting.load(votingContractAddress.toHexString());
  const voteId = event.params.voteId;
  if (votingInstance != null) {
    const voteIdentifier = event.address.toHexString() + "-" + voteId.toHexString();

    const voteInstance = Vote.load(voteIdentifier);

    if (voteInstance != null) {
      log.info('Voting contract {} having Vote with id {} is executed ', [votingContractAddress.toHexString(), voteId.toHexString()]);
      voteInstance.executed = true;
      voteInstance.executionDate = event.block.timestamp;
      voteInstance.save();
    }

  }
}