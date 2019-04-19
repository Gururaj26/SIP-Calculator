const fs = require('fs');
const helpers = require('./helpers');
const tableHeader = helpers.tableHeader;
const investmentObj = {
  currentInvestment: 3000,
  interestRate: 13.14,
  investmentTerm: 25,
  currentAge: 25,
  annualIncrement: 2000
}

function calculateSip() {
  let carryForwardAmount;
  let updatedInvestmentObj;
  let totalInvestment;
  let investmentArr = [];
  for (i = 1; i <= investmentObj.investmentTerm; i++) {
    if (investmentObj.annualIncrement && (i > 1)) {
      investmentObj.currentInvestment = investmentObj.currentInvestment + investmentObj.annualIncrement;
      totalInvestment = (investmentObj.currentInvestment * 12) + carryForwardAmount;
    } else {
      totalInvestment = investmentObj.currentInvestment * convertToMonths(i);
    }
    const interestEarned = Math.floor((totalInvestment * investmentObj.interestRate) / 100);
    const yearEndAccumulation = totalInvestment + interestEarned;
    carryForwardAmount = yearEndAccumulation;
    investmentObj.currentAge = i > 1 ? (investmentObj.currentAge + 1) : investmentObj.currentAge;
    updatedInvestmentObj = {
      ...investmentObj,
      term: i,
      totalInvestment: putCommas(totalInvestment),
      interestEarned: putCommas(interestEarned),
      corpusWithCAGR: putCommas(yearEndAccumulation),
      age: investmentObj.currentAge
    }
    investmentArr.push(updatedInvestmentObj);
  }
  constructTableBody(investmentArr);
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
    tableBody.push(`\n | ${x.age} | ${x.annualIncrement} | ${x.currentInvestment} | ${x.term} | ${x.interestRate} | ${x.totalInvestment} | ${x.interestEarned} | ${x.corpusWithCAGR} |`)
  })
  const fullTable = tableHeader.concat(tableBody.join(' '));
  writeToFile(fullTable);
}

calculateSip();
