import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  StartVote,
  CastVote,
  ExecuteVote
} from "../generated/templates/Voting/Voting"
import { Token, Voting, UserVote } from "../generated/schema";

export function handleNewVoteProposal(event: StartVote) : void {
  /**
   * Loads Voting object based on the event address, updates total votes created till now.
   * `creator` field is available from event's param.
   * 
   * Creates new Vote instance using Voting address and Vote ID in event
   * Populates other fields of Vote by calling `getVote` view method passing Vote Id 
   * available in event param. 
   */
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
}

export function handleVoteExecuted(event: ExecuteVote): void {
  /**
   * Loads Vote instance using event's address.
   *  - Mark `executed` field as true.
   *  - Update `executionBlock` field from event's block object
   */
}