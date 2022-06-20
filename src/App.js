import React, { useEffect } from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Timer from "./Timer"
import Stats from "./Stats"
export default function App(){
 //states for dice
 const [dice, setDice] = React.useState(allNewDice())
 //state for victory (tenzie)
 const [tenzi, setTenzi] = React.useState(false)

 //states dice rolls
 const [counter, setCounter] = React.useState(0)

 //states for timer
 const [isActive, setIsActive] = React.useState(false)
 const [isPaused, setIsPaused] = React.useState(false)
 const [time, setTime] = React.useState(0)

 //best time stat saves in local storage along with the rolls that occurred that round 
 const [stats, setStats] = React.useState({
  bestTime: JSON.parse(localStorage.getItem("bestTime")) || 0,
  rolls: JSON.parse(localStorage.getItem("rolls")) || 0
 })


 useEffect(()=>{
  //winning conditions: all dice have the same value and are held
  const firstValue = dice[0].value
  const isAllEqual = dice.every(die => die.value === firstValue)
  const isAllHeld = dice.every(die => die.isHeld)
  let interval = null
  //timer begins if active is true and paused is not true, otherwise timer stops
  if(isActive && isPaused === false){
   interval = setInterval(() => {
    setTime((time) => time + 10)
   }, 10)
  }else{
   clearInterval(interval)
  }

  //winning conditions: all dice are held and all have the same value
  if(isAllEqual && isAllHeld){
   setTenzi(true)
   setIsActive(false)
   setIsPaused(true)

   //for the first round store the current time as best time along with the amount of rolls that occurred that round
   if(stats.bestTime === 0 || JSON.parse(localStorage.getItem("bestTime")) === 0){
    setStats(() => ({
     bestTime: localStorage.setItem("bestTime", JSON.stringify(time)),
     rolls: localStorage.setItem("rolls", JSON.stringify(counter))
    }))
   }

   //checks for best time
   console.log("Time:" + time + " local storage:" +  localStorage.getItem("bestTime") + " stats.bestTime: " + stats.bestTime)
   if(time <  stats.bestTime){
    setStats(() => ({
     bestTime: localStorage.setItem("bestTime", JSON.stringify(time)),
     rolls: localStorage.setItem("rolls", JSON.stringify(counter))
    }))
   }
  }
  return () => {
   clearInterval(interval)
  }
 }, [dice, isActive, isPaused, time, stats, counter])

 //generates a single die
 function generateNewDie(){
  return{
   value: Math.ceil(Math.random() * 6),
   isHeld: false,
   id: nanoid()
  }
 }

 //generates new dice
 function allNewDice(){
  const newDice = []
  for(let i = 0; i < 10; i++){
   newDice.push(generateNewDie())
  }
  return newDice
 }

 /*when event occurs, timer is started, the amount of rolls is displayed
  (for that current round) as long as the player doesn't win,
  when the player wins, resets time, amount of rolls and game*/
 function rollDice(){
  if(!tenzi){
   setIsActive(true)
   setIsPaused(false)
   setCounter(prevCounter => prevCounter + 1)
   setDice(oldDice => oldDice.map(die => {
    return die.isHeld ? die : generateNewDie()
   }))
  }else{
   setTime(0)
   setTenzi(false)
   setCounter(0)
   setDice(allNewDice())
  }
 }

 function holdDice(id){
  setIsActive(true)
  setIsPaused(false)
  setDice(oldDice => oldDice.map(die => {
   return die.id === id ? {...die, isHeld: !die.isHeld} : die
  }))
 }
 const diceElements = dice.map(die => (
  <Die
   key={die.id}
   value={die.value}
   isHeld={die.isHeld}
   holdDice={() => holdDice(die.id)}
  />
 ))

 function clearData(){
  localStorage.setItem("bestTime", JSON.stringify(0))
  localStorage.setItem("rolls", JSON.stringify(0))
  alert("Best Score Cleared")
 }

 const bestStoredTime = localStorage.getItem("bestTime")
 const storedRolls = localStorage.getItem("rolls")

 return(
  <main>
   {tenzi && <Confetti/>}
   <h1 className="title">Tenzi Game</h1>
   <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls</p>
   <div className="dice-container">{diceElements}</div>
   <p><Timer time={time}/> Rolls: {counter}</p>
   <hr/>
   <Stats time={bestStoredTime} rolls={storedRolls}/>
   {tenzi && <button className="reset" onClick={clearData}>Clear Record</button>}
   <button className="roll-dice" onClick={rollDice}>{tenzi ? "New Game" : "Roll"}</button>
  </main>
 )
}