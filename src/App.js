import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState, useEffect, useRef } from "react";

import './App.css';

function App() {
  const [basicSalary, setBasicSalary] = useState(0);
  const [earning, setEarning] = useState([{ earning: '', epfEtf: false }]);
  const [deduction, setDeduction] = useState([{ deduction: '' }]);
  const [gEarning, setGEarning] = useState(0);
  const [gSalary, setGSalary] = useState(0);
  const [gDeduction, setGDeduction] = useState(0);
  const [empEpf, setempEpf] = useState(0);
  const [emperEpf, setEmperEpf] = useState(0);
  const [emperEtf, setEmperEtf] = useState(0);
  const [netSal, setNetSal] = useState(0);
  const [costCompany, setCostCompany] = useState(0);
  let inputRef = useRef()

  // BASIC SALARY
  const handleBasicSalary = (e) => {
    const basic = Number(e.target.value);
    setBasicSalary(basic)
  }

  // EARNING
  const handleAddAllowance = () => {
    setEarning([...earning, { earning: '', epfEtf: false }]);
  }
  const handleRemoveAllowance = (index) => {
    const item = [...earning];
    // remove only one item
    item.splice(index, 1);
    setEarning(item);
  }
  const handleEarnInput = (e, index, val) => {
    // Destructure name and value from event 
    const { name, value } = e.target;
    const item = [...earning];
    item[index][name] = val !== undefined ? val : value;
    setEarning(item);
  }

  // DEDUCTION
  const handleAddDeduction = () => {
    setDeduction([...deduction, { deduction: '' }]);
  }
  const handleRemoveDeduction = (index) => {
    const item = [...deduction];
    item.splice(index, 1);
    setDeduction(item);
  }
  const handleDeductionInput = (e, index) => {
    const { name, value } = e.target;
    const item = [...deduction];
    item[index][name] = value;
    setDeduction(item);
  }

  // GROSS SALARY
  useEffect(() => {
    let grossSalary = basicSalary + gEarning;
    setGSalary(grossSalary);
  }, [basicSalary, gEarning])


  // GROSS EARNING
  useEffect(() => {
    let grossEarning = 0;
    earning.forEach(element => {
      grossEarning += Number(element.earning);
    });
    setGEarning(grossEarning);
  }, [earning])

  // GROSS DEDUCTION
  useEffect(() => {
    let grossDeduction = 0;
    deduction.forEach(element => {
      grossDeduction += Number(element.deduction);
    });
    setGDeduction(grossDeduction);
  }, [deduction])

  // EMPLOYEE/EMPLOYER EPF/ETF
  useEffect(() => {
    // Filter data from array where epfEtf property is true
    const empEpft = earning.filter(e => e.epfEtf === true);
    let empEpftResult = 0;
    // Filtered epfEtf propery value total
    empEpft.forEach(element => {
      empEpftResult += Number(element.earning);
    });

    // EMPLOYEE EPF(8%)
    let employeeEpf = (basicSalary + empEpftResult) * 0.08;
    setempEpf(employeeEpf);

    // EMPLOYER EPF(12%)
    let employerEpf = (basicSalary + empEpftResult) * 0.12;
    setEmperEpf(employerEpf);

    // EMPLOYER ETF(3%)
    let employerEtf = (basicSalary + empEpftResult) * 0.03;
    setEmperEtf(employerEtf);
  }, [basicSalary, earning])

  // NET SALARY
  useEffect(() => {
    let netSalary = gSalary - gDeduction - empEpf;
    setNetSal(netSalary);
  }, [gSalary, gDeduction, empEpf])

  // COST TO COMPANY
  useEffect(() => {
    let costToCompany = gSalary - gDeduction + emperEpf + emperEtf;
    setCostCompany(costToCompany);
  }, [gSalary, gDeduction, emperEpf, emperEtf])

  // RESET CALCULATOR
  const handleReset = () => {
    inputRef.current.value = "";
    setBasicSalary(0);
    setEarning([{ earning: '', epfEtf: false }]);
    setDeduction([{ deduction: '' }]);
  }

  return (

  // Start salary Calculate section
    <section className="main-wrapper d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-7 col-12">
            <div className="cal-left">
              <div className="form-wrap">
                <div className="form-title">
                  <h3>Calculate your salary</h3>
                  <button className='btn-refresh' onClick={handleReset}><i class="fa-solid fa-rotate-left"></i>Reset</button>
                </div>

                <form>
                  <div className="col-8 form-group input-group-md">
                    <label htmlFor="basicSalary">Basic Salary</label>
                    <input type="number" className="form-control" ref={inputRef} onChange={handleBasicSalary} id="basicSalary" name="basicSalary" placeholder="Basic Salary" />
                  </div>

                  <div className="form-group input-group-md ">
                    <label className="d-block" htmlFor="earning">Earnings</label>
                    <small>Allowance, Fixed Allowance, Bonus and etc.</small>
                    {earning.map((value, index) => (
                      <div key={index}>
                        <div className="col-12 form-group input-wrap">
                          <div className='col-8'>
                            <input type="number" className="form-control new-allocation-mar" id="earning" name="earning" placeholder="Earning" value={value.earning} onChange={(e) => handleEarnInput(e, index)} />
      
                          </div>
                          <div className="col-4 checkbox-input-wrap">
                            {/* Show remove btn when input item is greater than 1 else hide */}
                            {earning.length > 1 && <button className="input-remove" onClick={() => handleRemoveAllowance(index)}><i class="fa-solid fa-xmark"></i></button>}
                            <div className='form-check'>
                              <input type="checkbox" name="epfEtf" value={value.epfEtf} onChange={(e) => handleEarnInput(e, index, e.target.checked)} />
                              <label htmlFor="epfEtf">EPF/ETF</label>
                            </div>
                          </div>
                        </div>
                        {/* Include add button only to the last feild */}
                        {earning.length - 1 === index && <button className="add-input" onClick={handleAddAllowance}><i class="fa-solid fa-plus"></i>Add New Allowance</button>}
                      </div>
                    ))}
                  </div>

                  <hr/>

                  <div className="col-8 form-group input-group-md">
                    <label className="d-block" htmlFor="deduction">Deductions</label>
                    <small>Salary Advances, Loan Deductions and all</small>
                    {deduction.map((value, index) => (
                      <div key={index}>
                        <div className="input-wrap">
                          <input type="number" className="form-control new-allocation-mar" id="deduction" name="deduction" placeholder="Deduction" value={value.deduction} onChange={(e) => handleDeductionInput(e, index)} />
                          {deduction.length > 1 && <button className="input-remove" onClick={() => handleRemoveDeduction(index)}><i class="fa-solid fa-xmark"></i></button>}
                        </div>
                        {deduction.length - 1 === index && <button className="add-input" onClick={handleAddDeduction}><i class="fa-solid fa-plus"></i>Add New Deduction</button>}
                      </div>
                    ))}
                  </div>

                </form>
              </div>
            </div>
          </div>

          <div className="col-md-5 col-12">
            <div className="cal-right">
              <div className="result-wrap">
                <h3>Your Salary</h3>
                <div className="result-item">
                  <div className="result-item-wrap">
                    <h6>Items</h6>
                    <h6>Amount</h6>
                  </div>
                  <div className="result-item-wrap">
                    <p>Basic Salary</p>
                    <p>{basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="result-item-wrap">
                    <p>Gross Earning</p>
                    <p>{gEarning.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="result-item-wrap">
                    <p>Gross Deduction</p>
                    <p>{gDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="result-item-wrap">
                    <p>Employee EPF (8%)</p>
                    <p>{empEpf.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="mid-wrap">
                    <h5>Net Salary (Take Home)</h5>
                    <h5>{netSal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
                  </div>
                  <div className="result-item-wrap">
                    <h6>Contribution from the employer</h6>
                  </div>
                  <div className="result-item-wrap">
                    <p>Employeer EPF (12%)</p>
                    <p>{emperEpf.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="result-item-wrap">
                    <p>Employeer ETF (3%)</p>
                    <p>{emperEtf.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="result-item-wrap wrap-last">
                    <p>CTC (Cost to Company)</p>
                    <p>{costCompany.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    // end salary Calculate section


  );
}

export default App;
