const fs = require('fs');
const helpers = require('./helpers');
const tableHeader = helpers.tableHeader;
const investmentObj = {
  currentInvestment: 3000,
  interestRate: 13.14,
  investmentTerm: 25,
  currentAge: 25,
  annualIncrement: 2000,
  currency: 'INR'
}

function calculateSip() {
  let carryForwardAmount = 0;
  let updatedInvestmentObj;
  let totalInvestment;
  let investmentArr = [];
  for (i = 1; i <= investmentObj.investmentTerm; i++) {
    if (investmentObj.annualIncrement && (i > 1)) {
      investmentObj.currentInvestment = investmentObj.currentInvestment + investmentObj.annualIncrement;
      totalInvestment = investmentObj.currentInvestment * 12
    } else {
      totalInvestment = investmentObj.currentInvestment * convertToMonths(i);
    }
    const interestEarned = Math.floor((totalInvestment * investmentObj.interestRate) / 100);
    const yearEndAccumulation = totalInvestment + interestEarned + carryForwardAmount;
    investmentObj.currentAge = i > 1 ? (investmentObj.currentAge + 1) : investmentObj.currentAge;
    updatedInvestmentObj = {
      ...investmentObj,
      term: i,
      totalInvestment: totalInvestment,
      interestEarned: interestEarned,
      carryForwardAmount: carryForwardAmount,
      corpusWithCAGR: yearEndAccumulation,
      age: investmentObj.currentAge
    }
    investmentArr.push(updatedInvestmentObj);
    carryForwardAmount = yearEndAccumulation;
  }
  constructTableBody(investmentArr);
}

function getUnit(value){
  let leng = value.toString().length;
  let unit = leng == 6 ? ' lakh' : leng == 7 ? ' lakh': leng == 8 ? 'Cr' : leng == 9 ? 'Cr' : ''
  return `${putCommas(value) + unit}`
}

function convertToMonths(years) {
  return years * 12;
}

function putCommas(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function writeToFile(tableBody){
  const fileName = `${investmentObj.currentInvestment}_at_${investmentObj.interestRate}_interest.md`;
  fs.writeFile(fileName, tableBody, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`Congratulations !!`);
  });
}

function constructTableBody(investmentArr) {
  let tableBody = [];
  investmentArr.map((x, i) => {
    tableBody.push(`\n | ${x.term} | ${x.age} | ${getUnit(x.carryForwardAmount)} | ${putCommas(x.currentInvestment)} | ${x.interestRate} | ${getUnit(x.corpusWithCAGR)} | ${x.annualIncrement} |`)
  })
  const fullTable = tableHeader.concat(tableBody.join(' '));
  writeToFile(fullTable);
}

calculateSip();
