import React, { useState } from 'react';
import PieChartComponent from './PieChartComponent'; // Correct import, ensure path is correct

function TaxCalculator() {
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState('');
    const [yearsOfOperation, setYearsOfOperation] = useState('');
    const [annualTurnover, setAnnualTurnover] = useState('');
    const [averageAnnualTurnover, setAverageAnnualTurnover] = useState('');
    const [tax, setTax] = useState(null);
    const [afterTaxIncome, setAfterTaxIncome] = useState(null);

    const handleIncomeChange = event => setIncome(event.target.value);
    const handleExpensesChange = event => setExpenses(event.target.value);
    const handleYearsChange = event => setYearsOfOperation(event.target.value);
    const handleTurnoverChange = event => setAnnualTurnover(event.target.value);
    const handleAverageTurnoverChange = event => setAverageAnnualTurnover(event.target.value);

    const calculate = () => {
        const parsedIncome = parseFloat(income);
        if (!isNaN(parsedIncome) && !isNaN(parseFloat(expenses)) && !isNaN(parseFloat(yearsOfOperation)) && !isNaN(parseFloat(annualTurnover)) && !isNaN(parseFloat(averageAnnualTurnover))) {
            const calculatedTax = calculateTax(parsedIncome, parseFloat(expenses), parseFloat(yearsOfOperation), parseFloat(annualTurnover), parseFloat(averageAnnualTurnover));
            setTax(calculatedTax);
            setAfterTaxIncome(parsedIncome - expenses);
        }
    };

    // Prepare data for the pie chart
    const pieChartData = {
        labels: ['Συνολικός Φόρος', 'Φορολογήσιμο Εισόδημα'],
        values: [tax || 0, afterTaxIncome || 0]  // Ensure values are not null
    };

    return (
        <div className="container mt-5">
            <h1>Υπολογισμός Φόρου Εισοδήματος</h1>
            <div className="form-group">
                <label>Εισόδημα (σε EUR)</label>
                <input type="number" className="form-control mb-2" value={income} onChange={handleIncomeChange} placeholder="Εισαγωγή εισοδήματος σε EUR" />
                <label>Έξοδα ετησίως (σε EUR)</label>
                <input type="number" className="form-control mb-2" value={expenses} onChange={handleExpensesChange} placeholder="Εισαγωγή ετησίων εξόδων σε EUR" />
                <label>Έτη λειτουργίας</label>
                <input type="number" className="form-control mb-2" value={yearsOfOperation} onChange={handleYearsChange} placeholder="Εισαγωγή ετών λειτουργίας" />
                <label>Ετήσιος τζίρος (σε EUR)</label>
                <input type="number" className="form-control mb-2" value={annualTurnover} onChange={handleTurnoverChange} placeholder="Εισαγωγή ετήσιου τζίρου σε EUR" />
                <label>Μέσος ετήσιος τζίρος ΚΑΔ (σε EUR)</label>
                <input type="number" className="form-control mb-2" value={averageAnnualTurnover} onChange={handleAverageTurnoverChange} placeholder="Εισαγωγή μέσου ετήσιου τζίρου ΚΑΔ σε EUR" />
                <button className="btn btn-primary" onClick={calculate}>Υπολογισμός Φόρου</button>
            </div>
            {tax !== null && (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Περιγραφή</th>
                                <th>Ποσό (σε EUR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Φορολογήσιμο Εισόδημα</td>
                                <td>{(income - expenses).toFixed(2)}€</td>
                            </tr>
                            <tr>
                                <td>Εκτιμώμενος Φόρος</td>
                                <td>{tax.toFixed(2)}€</td>
                            </tr>
                            <tr>
                                <td>Καθαρό Εισόδημα</td>
                                <td>{(income - expenses - tax).toFixed(2)}€</td>
                            </tr>
                            <tr>
                                <td>Μηνιαίο Καθαρό Εισόδημα</td>
                                <td>{((income - expenses - tax) / 12).toFixed(2)}€</td>
                            </tr>
                        </tbody>
                    </table>
                    <PieChartComponent data={pieChartData} />
                </div>
            )}
        </div>
    );       
}

function calculateTax(income, expenses, yearsOfOperation, annualTurnover, averageAnnualTurnover) {
    // Calculate taxable income after deducting expenses
    const taxableIncome = income - expenses;

    let tax = 0;
    const baseTaxRates = { level1: 0.09, level2: 0.22, level3: 0.28, level4: 0.36, level5: 0.44 };
    if (taxableIncome <= 10000) {
        tax = taxableIncome * baseTaxRates.level1;
    } else if (taxableIncome <= 20000) {
        tax = 10000 * baseTaxRates.level1 + (taxableIncome - 10000) * baseTaxRates.level2;
    } else if (taxableIncome <= 30000) {
        tax = 10000 * baseTaxRates.level1 + 10000 * baseTaxRates.level2 + (taxableIncome - 20000) * baseTaxRates.level3;
    } else if (taxableIncome <= 40000) {
        tax = 10000 * baseTaxRates.level1 + 10000 * baseTaxRates.level2 + 10000 * baseTaxRates.level3 + (taxableIncome - 30000) * baseTaxRates.level4;
    } else {
        tax = 10000 * baseTaxRates.level1 + 10000 * baseTaxRates.level2 + 10000 * baseTaxRates.level3 + 10000 * baseTaxRates.level4 + (taxableIncome - 40000) * baseTaxRates.level5;
    }

    const taxAdjustmentFactors = getTaxAdjustmentFactors(yearsOfOperation, annualTurnover, averageAnnualTurnover);
    tax *= taxAdjustmentFactors.adjustmentFactor;
    return tax;
}

function getTaxAdjustmentFactors(years, turnover, avgTurnover, declaredIncome, taxableIncome) {
    let adjustmentFactor = 1;

    // Calculate the percentage excess of turnover over average turnover
    const turnoverExcessPercentage = (turnover / avgTurnover - 1) * 100;

    // Check if turnover exceeds average turnover
    if (turnover > avgTurnover) {
        // Apply adjustments based on the percentage excess of turnover
        if (turnoverExcessPercentage < 150) {
            adjustmentFactor += 0.35;
        } else if (turnoverExcessPercentage < 200) {
            adjustmentFactor += 0.75;
        } else {
            adjustmentFactor += 1.00;
        }
    }
    // Additional adjustments based on specific cases
    if (years < 3) {
        // For the first three years, no adjustment
    } else if (years === 3) {
        // For the third year, increase by 10%
        adjustmentFactor += 0.10;
    } else if (years === 4) {
        // For the fourth year, increase by 20% (10% on the previously determined factor)
        adjustmentFactor += 0.20;
    } else if (years === 5) {
        // For the fifth year, increase by 30% (10% on the previously determined factor)
        adjustmentFactor += 0.30;
    }

    // Apply adjustments based on declared income
    if (years < 4){
        adjustmentFactor = 1
    } else if (taxableIncome < declaredIncome) {
        // If taxable income is less than declared income, reduce tax by 25%
        adjustmentFactor -= 0.25;
    } else if (taxableIncome > declaredIncome) {
        // If taxable income is more than declared income, reduce tax by 50%
        adjustmentFactor -= 0.50;
    }

    // Apply additional adjustments based on specific cases

    return { adjustmentFactor };
}


export default TaxCalculator;
