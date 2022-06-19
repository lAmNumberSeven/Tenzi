import React from "react"
export default function BestStats(props){
 return(
  <div className="best-stats">
   <span>Best Time: </span>
   <span>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}:</span>
   <span>{("0" + Math.floor((props.time / 1000) % 60)).slice(-2)}.</span>
   <span>{("0" + ((props.time / 10) % 100)).slice(-2)}</span>
   <span> Rolls: {props.rolls}</span>
  </div>
 )
}