import React from 'react';
import { Link } from 'react-router-dom';

export const StudentPaymentHistoryPage = (props) => {
  console.log('props.payments', props.payments)


  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>number of payments found: {props.payments.length}</div>
      <div className='search-input-container-div'>
        <input
          type="text"
          placeholder="Search for a payment..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
          <table className="payment-table">
            <thead>
              <tr>
                <th>payment ID</th>
                <th>Student Name</th>
                <th>AmountPaid(Ghc)</th>
                <th>initial Balance(Ghc)</th>
                <th>current Balance(Ghc)</th>
                <th>Payment Date</th>
                <th>fee description</th>
                {/* <th>Received From</th> */}
                {/* <th>Comment</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {props.payments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.id!==''? payment.id: 'N/A'}</td>
                  <td>{payment.id? payment.StudentName: 'N/A'}</td>
                  <td>{payment.AmountPaid.toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })} 
                  </td>
                  <td>{(-1 * payment.InitialAccountBalance).toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{(-1 * payment.CurrentBalance).toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{payment.PaymentDate}</td>
                  <td>{payment.FeesName}</td>
                  <td>
                  <Link to={`/viewStudentDetails/${encodeURIComponent(payment.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link>
                  <Link to={`/viewStudentDetails/${encodeURIComponent(payment.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Print</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div>
        <input type="button" value="add a new payment" className='search-button' />
      </div> */}
    </form>
  );
};
