// Global variables for salary values and 
var actualSalary = 0;
var expenses = [];

$(document).ready(function () {
    // First hide the Expense div
    $(".Expense").hide();
});

$(".addbutton").click(function(){
    // Get values from input fields
    var salary = $(".Salary").val();
    var month = $(".Month").val();

    // Check if any input field is empty
    if (salary === "" || month === "") {
      alert("Please fill in all fields.");
      return;
    }

    //update value into the global variable
    actualSalary = salary;

    // Create h2 elements in the Title div
    $(".Title").html(`<h2>Salary: ${salary}</h2><h2>Month: ${month}</h2>`);
  
    // Hide salaryInput div and display Expense div
    $(".salaryInput").hide();
    $(".Expense").show();
});

$(".addExpenseButton").click(function(){
    // Get values from expense input fields
    var expenseAmount = parseFloat($(".Cost").val());
    var expenseFor = $(".For").val();

    // required validation
    if (expenseAmount === 0 || expenseFor === "") {
        alert("Please fill in all fields.");
        return;
    }

    // amount should value should not higher then expense amount
    if (expenseAmount > parseFloat(actualSalary)) {
        alert("Expense amount cannot be more than remaining salary.");
        return;
    }

     // Deduct expense amount from salary
     actualSalary = parseFloat(actualSalary) - expenseAmount;

     // Get total expense
     var totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0) + expenseAmount;

     // Add expense details to the expenses array
     expenses.push({ id: new Date().getTime(), amount: expenseAmount, for: expenseFor });

     // Create expense table and display in detailedView div
     renderExpenseTable();
     renderDetailedView();

      // Clear expense input fields
      $(".Cost, .For").val("");
});

 // Function to render the expense table
 function renderExpenseTable() {
    var expenseTable = "<table><thead><tr><th>Expense</th><th>Expense for</th><th>Action</th></tr></thead><tbody>";
    expenses.forEach((exp) => {
        expenseTable += `<tr><td>${exp.amount}</td><td>${exp.for}</td><td><button class="revokeButton" onclick="removeRow(${exp.id},${exp.amount})" data-expense-id="${exp.id}">Revoke</button></td></tr>`;
    });
    expenseTable += "</tbody></table>";

    // Append content to expenseTableContainer div
    $(".detailedView").show();
    $(".detailedView").html(expenseTable);
}

// Function to render the detailed view
function renderDetailedView() {
    // Calculate remaining salary and total expense
    var remainingSalary = actualSalary - expenses.reduce((total, expense) => total + expense.amount, 0);
    var totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

    // Create div with h3 for remaining salary and total expense
    var detailedViewContent = `<div><h3>Remaining Salary: ${actualSalary}</h3><h3>Total Expense: ${totalExpense}</h3></div>`;

    // Append content to detailedView div
    var currentHTML = $(".detailedView").html();
    $(".detailedView").html(currentHTML + detailedViewContent);
}

// delete row from table
function removeRow(expId, amount)
{
    expenses = expenses.filter(expense => expense.id !== expId);
    
    // add revoked amount again into the actual salary value
    actualSalary = actualSalary + amount;

    // if all expense removed then hide the table
    if(expenses.length == 0){
        $(".detailedView").hide();
    }else{
        renderExpenseTable();
        renderDetailedView();
    }
}