import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import BigCountdown from './BigCountdown'
import { TbArrowBigLeft, TbArrowBigRight } from 'react-icons/tb'

function TicketCard({ ticketCard, ticketCards, setTicketCards, index }) {

  const handleClose = () => {
    setTicketCards(ticketCards.filter((card, j) => j !== index))
  }
  const handleTypeClick = (type) => {
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, isDouble: type } : card
    )
    setTicketCards(updatedTicketCards)
  }
  const increaseFirstDigit = () => {
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, firstDigit: (card.firstDigit + 1) % 10 , isFirst: true} : card
    )
    setTicketCards(updatedTicketCards)
  }
  const decreaseFirstDigit = () => {
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, firstDigit: card.firstDigit > 0 ? card.firstDigit - 1 : 9, isFirst: true } : card
    )
    setTicketCards(updatedTicketCards)
  }
  const increaseSecondDigit = () => {
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, secondDigit: (card.secondDigit + 1) % 10 , isFirst: false} : card
    )
    setTicketCards(updatedTicketCards)
  }
  const decreaseSecondDigit = () => {
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, secondDigit: card.secondDigit  > 0 ? card.secondDigit - 1 : 9, isFirst: false } : card
    )
    setTicketCards(updatedTicketCards)
  }

  const handleDigitClick = isFirst => {
    if (ticketCard.isDouble) {
      return
    }
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, isFirst: isFirst } : card
    )
    setTicketCards(updatedTicketCards)
  }

  const arrowDateHandler = isLeft => {
    let _ticketId = ticketCard.ticketId
    if (isLeft) {
      _ticketId--
    } else {
      _ticketId++
    }
    if (_ticketId < ticketCard.currentId) {
      _ticketId = ticketCard.currentId
    }
    if (_ticketId > ticketCard.currentId + 6) {
      _ticketId = ticketCard.currentId + 6
    }
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, ticketId: _ticketId, ticketDate: card.currentEndTime + (_ticketId - card.currentId) * 3600 * 24} : card
    )
    setTicketCards(updatedTicketCards)
  }

  const ticketAmountChange = e => {
    const value = Math.max(e.target.value, 5)
    const updatedTicketCards = ticketCards.map((card, j) =>
      j === index ? { ...card, ticketAmount: value} : card
    )
    setTicketCards(updatedTicketCards)
  }
  return (
    <div className="border border-[#ecc440] rounded-xl  relative py-2 px-8 m-auto">
      <div className="absolute right-1 cursor-pointer" onClick={handleClose}>
        <IoClose fill="#ecc440" className="arrow-icon" />
      </div>
      <div className="ticket-title flex items-center justify-center py-2">
        <button onClick={() => arrowDateHandler(true)}>
          <TbArrowBigLeft
            fill={`${ticketCard.ticketId == ticketCard.currentId ? '#5d4e12' : '#ecc440'}`}
            className="arrow-icon mr-2"
          />
        </button>
        <div>
          <p className="text-md">
            Draw Date:{' '}
            <span className="text-[#f3cc2f]">
              {new Date(ticketCard.ticketDate * 1000).toDateString()}
            </span>
          </p>
          <p className="text-md">
            Draw Time: <span className="text-[#f3cc2f]">09:30 AM (GMT-6)</span>
          </p>
        </div>
        <button onClick={() => arrowDateHandler(false)}>
          <TbArrowBigRight
            fill={`${ticketCard.ticketId == ticketCard.currentId + 6 ? '#5d4e12' : '#ecc440'}`}
            className="arrow-icon ml-2"
          />
        </button>
      </div>
      <div
        className="bg-[#1c1c1c] rounded-[25px] px-3 py-6 max-w-[280px]  mx-auto"
        style={{ marginTop: '24px' }}
      >
        <p className="text-center">Tickets Closing In</p>
        <BigCountdown futureDate={ticketCard.ticketDate + 3600 * 24} />
      </div>
      <div className="flex justify-center mb-4 mt-4">
        <button
          className={`rounded-full ${
            !ticketCard.isDouble ? 'bg-[#2f6434]' : 'bg-[#a6b1a8]'
          } px-4 py-3 text-white ml-4`}
          onClick={() => handleTypeClick(false)}
        >
          Single
        </button>
        <button
          className={`rounded-full ${
            ticketCard.isDouble ? 'bg-[#2f6434]' : 'bg-[#a6b1a8]'
          } px-4 py-3 text-white ml-4`}
          onClick={() => handleTypeClick(true)}
        >
          Double
        </button>
      </div>
      <div className="flex py-4 justify-center border border-[#ecc440] rounded-xl min-h-[193px]">
        <div className="flex-col !flex items-center mx-2 justify-center rounded-2xl z-10">
          <button
            type="button"
            className="w-7 m-1 h-7 inline-flex items-center justify-center p-1 text-md rounded-3xl bg-[#99efa2] text-black font-bold"
            onClick={increaseFirstDigit}
          >
            +
          </button>
          <button onClick={() => handleDigitClick(true)}>
            <h3
              className={`${
                ticketCard.isDouble ? '' : ticketCard.isFirst ? '' : 'opacity-25'
              } w-14 h-14 inline-flex items-center justify-center bg-golden-gradient text-black rounded-full text-xl font-bold`}
            >
              {ticketCard.firstDigit}
            </h3>
          </button>
          <button
            type="button"
            className="w-7 h-7 m-1 inline-flex items-center justify-center p-1 rounded-3xl bg-[#99efa2] text-black font-bold"
            onClick={decreaseFirstDigit}
          >
            -
          </button>
          {!ticketCard.isDouble && <p className="mt-3"> 1st Digit</p>}
        </div>
        <div className="flex-col !flex items-center mx-2 justify-center rounded-2xl z-10">
          <button
            type="button"
            className="w-7 m-1 h-7 inline-flex items-center justify-center p-1 text-md rounded-3xl bg-[#99efa2] text-black font-bold"
            onClick={increaseSecondDigit}
          >
            +
          </button>
          <button onClick={() => handleDigitClick(false)}>
            <h3
              className={`${
                ticketCard.isDouble ? '' : ticketCard.isFirst ? 'opacity-25' : ''
              } w-14 h-14 inline-flex items-center justify-center bg-golden-gradient text-black rounded-full text-xl font-bold`}
            >
              {ticketCard.secondDigit}
            </h3>
          </button>
          <button
            type="button"
            className="w-7 h-7 m-1 inline-flex items-center justify-center p-1 rounded-3xl bg-[#99efa2] text-black font-bold"
            onClick={decreaseSecondDigit}
          >
            -
          </button>
          {!ticketCard.isDouble && <p className="mt-3"> 2nd Digit</p>}
        </div>
      </div>
      <div className="relative mt-4 mb-2 flex items-center justify-center flex-wrap gap-2 xl:gap-4">
        <p className="text-base">
          <strong className="text-amber-300 text-xl">Ticket Amount:</strong>{' '}
          <input
            className="bg-transparent border border px-2 border-[#ecc440] rounded-xl text-xl max-w-[100px] mr-2 ml-2"
            type="number"
            value={ticketCard.ticketAmount}
            onChange={ticketAmountChange}
          />
          USDT
        </p>
      </div>
      <div className="relative  flex items-center justify-center flex-wrap gap-2">
        <p className="text-base">
          <strong className="text-amber-300">Minimum Ticket Amount:</strong>{' '}
          {/* {minTicketPrice} */}5 USDT
        </p>
      </div>
    </div>
  )
}

export default TicketCard
