import React from 'react';
import { Link } from 'react-router-dom';

const PaymentListPage = (props) => {
  const currentDate = new Date().toISOString().split('T')[0];


  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>number of Payments: {props.payments?.length} || total Payments for date: {props.totalExpensesForDate}</div>
      <div className='search-input-container-div'>
        <input
          type="text"
          placeholder="Search for a payment with student name or comment or type of fees..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
        <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/selectStudent`}>
            Receive Payment
          </Link>
          <form onSubmit={props.handleSubmit}>
          Date Start: <input type="date" style={{marginRight: '10px'}} name='startDate' value={props.dateFormData.startDate} onChange={props.handleInputChange1} max={currentDate}/>
          Date End: <input type="date" name='endDate' value={props.dateFormData.endDate} onChange={props.handleInputChange1} max={currentDate}/>
          <input type="button" onClick={props.handleSubmit} value='Load' className='form-button' style={{marginLeft: '10px'}}/>
          </form>
          <table className="payment-table">
            <thead>
              <tr>
                <th>payment ID</th>
                <th>Student Name</th>
                <th>AmountPaid(Ghc)</th>
                <th>initial Balance(Ghc)</th>
                <th>New Balance(Ghc)</th>
                <th>Payment Date</th>
                <th>fee description</th>
                {/* <th>Received From</th> */}
                {/* <th>Comment</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {props.payments?.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.StudentName}</td>
                  <td>{payment.AmountPaid.toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })} </td>
                  <td>{(-1 * payment.InitialAccountBalance).toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })}</td>
                  <td>{(-1* payment.CurrentBalance).toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{payment.PaymentDate}</td>
                  <td>{payment.FeesName}</td>
                  {/* <td>{payment.ReceivedFrom}</td> */}
                  {/* <td>{payment.Comment}</td> */}
                  <td>
                  {/* <Link to={`/viewStudentDetails/${encodeURIComponent(payment.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link> */}
                  <Link target='_blank' to={`/printPayment/${encodeURIComponent(payment.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Print</Link>
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

export default PaymentListPage;
