import React from 'react';
import { Link } from 'react-router-dom';

 export const ExpensesListingPage = (props) => {

  const currentDate = new Date().toISOString().split('T')[0];


  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>number of expenses: {props.results.length} || total expenses for date: {props.totalExpensesForDate}</div>

      <br />
      <div className='search-input-container-div'>
        <input
          type="text"
          placeholder="Search for a Receipient or Purpose..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/addExpenses`}>
            Spend Money
          </Link>
          <form onSubmit={props.handleSubmit}>
          Date Start: <input type="date" style={{marginRight: '10px'}} name='startDate' value={props.dateFormData.startDate} onChange={props.handleInputChange1} max={currentDate}/>
          Date End: <input type="date" name='endDate' value={props.dateFormData.endDate} onChange={props.handleInputChange1} max={currentDate}/>
          <input type="button" onClick={props.handleSubmit} value='Load' className='form-button' style={{marginLeft: '10px'}}/>
          </form>
          <table className="student-table">
            <thead>
              <tr>
                <th>expense ID</th>
                <th>Amount Spent(GHC)</th>
                <th>Recipient</th>
                <th>Purpose</th>
                <th>Date</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results?.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{(expense.amountpaid).toLocaleString('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{expense.receipient}</td>
                  <td>{expense.purpose}</td>
                  <td>{expense.dateadded}</td>
                  <td>
                    <Link to={`/editClassDetails/${encodeURIComponent(expense.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Print</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div>
        <input type="button" value="add a new student" className='search-button' />
      </div> */}
    </form>
  );
};

