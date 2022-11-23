import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  StartVote,
  ExecuteVote,
  CastVote
} from "../generated/templates/Voting/Voting"
import { Transfer } from "../generated/templates/Token/Token"

export function createStartVote(voteId: BigInt, metadata: string, creator: Address): StartVote {
  let deployStartVote = changetype<StartVote>(newMockEvent())

  deployStartVote.parameters = new Array()

  deployStartVote.parameters.push(
    new ethereum.EventParam("voteId", ethereum.Value.fromSignedBigInt(voteId))
  );

  deployStartVote.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  );

  deployStartVote.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  );

  return deployStartVote;
}

export function createExecuteVote(dao: Address): ExecuteVote {
  let deployExecuteVote = changetype<ExecuteVote>(newMockEvent())

  deployExecuteVote.parameters = new Array()

  deployExecuteVote.parameters.push(
    new ethereum.EventParam("dao", ethereum.Value.fromAddress(dao))
  )

  return deployExecuteVote;
}

export function createCastVote(voteId: BigInt, voter: Address, supports: boolean, stake: BigInt): CastVote {
  let deployCastVote = changetype<CastVote>(newMockEvent())

  deployCastVote.parameters = new Array()

  deployCastVote.parameters.push(
    new ethereum.EventParam("voteId", ethereum.Value.fromSignedBigInt(voteId))
  );
  deployCastVote.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  );
  deployCastVote.parameters.push(
    new ethereum.EventParam("supports", ethereum.Value.fromBoolean(supports))
  );
  deployCastVote.parameters.push(
    new ethereum.EventParam("stake", ethereum.Value.fromUnsignedBigInt(stake))
  );

  return deployCastVote;
}