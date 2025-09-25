import React, { useState, useEffect } from 'react'
import { TbTrashFilled } from 'react-icons/tb'

function TicketTable({ ticketCards, setTicketCards }) {
  console.log('ticketCard', ticketCards)

  const handleClose = (index) => {
    setTicketCards(ticketCards.filter((card, j) => j !== index))
  }


  return (
    <table className="w-full text-sm text-white border border-[#ecc440]">
      <thead className="text-xs uppercase bg-[#1c1c1c]">
        <tr>
          <th scope="col" className="px-1 py-2 md:py-4 col-span-3 ">
            Serial Number
          </th>
          <th scope="col" className="px-1 py-2 md:py-4">
            Date of Draw
          </th>
          <th scope="col" className="px-1 py-2 md:py-4 ">
            Ticket Type
          </th>
          <th scope="col" className="px-1 py-2 md:py-4">
            Ticket Number
          </th>
          <th scope="col" className="px-1 py-2 md:py-4">
            Ticket Amount
          </th>
          <th scope="col" className="px-1 py-2 md:py-4">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="text-center">
        {ticketCards.map((card, index) => (
          <tr className="border border-[#ecc440]" key={index}>
            <th
              scope="row"
              className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white"
            >
              {index + 1}
            </th>
            <td className="px-1 py-2">{new Date(card.ticketDate * 1000).toDateString()}</td>
            <td className="px-1 py-2">{card.isDouble ? 'Double' : card.isFirst ? '1st Digit' : '2nd Digit'}</td>
            <td className="px-1 py-2">{card.isDouble ? card.firstDigit + card.secondDigit * 10 : card.isFirst ? card.firstDigit + 'X' : 'X' + card.secondDigit}</td>
            <th scope="col" className="px-1 py-2">{card.ticketAmount}</th>
            <td className="px-1 py-2">
              <button onClick={() => handleClose(index)}>
                <TbTrashFilled style={{ margin: 'auto' }} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TicketTable
