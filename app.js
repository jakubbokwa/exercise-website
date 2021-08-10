// External source
const customers =
  "https://gist.githubusercontent.com/michaelKurowski/93a32a8580f9e430d7b924d8dd858b33/raw/61683517d7311ebf06c4840947ef613297ef9673/customers.json";
const companies =
  "https://gist.githubusercontent.com/michaelKurowski/93a32a8580f9e430d7b924d8dd858b33/raw/61683517d7311ebf06c4840947ef613297ef9673/companies.json";
// Locally
// const customers = "./customers.json";
// const companies = "./companies.json";

// Load the data
const loadData = async () => {
  try {
    const customersRes = await fetch(customers);
    const companiesRes = await fetch(companies);
    const customersData = await customersRes.json();
    const companiesData = await companiesRes.json();
    return (data = { customers: customersData, companies: companiesData });
  } catch (e) {
    console.log("There has been an error fetching the data");
    console.log(e);
  }
};

let data = (async () => await loadData())();

// Functionality: alert when both of the JSON files have been loaded.
const dataLoadedAlert = async () => {
  try {
    await data;
    return alert("The data has been loaded");
  } catch (e) {
    console.log(e);
  }
};

dataLoadedAlert();
// End of loading the data

// FIRST FUNCTIONALIY: THE SEARCH BAR
// Identify the search bar
const searchBar = document.forms["search-companies"].querySelector("input");

// Identify the div holding the search results
const searchResults = document.getElementsByClassName(
  "company-search-results"
)[0];

// Initialize the array holding the results and the timeout used in the searching process
let companyArr = [];
let timeout = null;

// Add listener to the search bar
searchBar.addEventListener("keyup", (e) => {
  e.preventDefault();

  // Clear the search results each time a new string is being searched
  companyArr = [];
  // Break the timeout countdown every time a keyup happens = searching is not finished yet
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Reset the div holding the search results every time a new query is made
    searchResults.innerHTML = "";
    // Find companies who have the searched string in their name and put them into an array
    data.companies.forEach((company) => {
      if (
        e.target.value.length > 2 &&
        company.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      ) {
        companyArr = [...companyArr, company];
      }
    });
    // Map the entries of the array to project the list of companies into the
    // HTML structure of the page. The limit I set is 10 entries.
    companyArr.map((singleCompany, idx) => {
      if (idx > 10) {
        return;
      }
      const { name, code, domain } = singleCompany;

      const compName = document.createElement("h2");
      compName.innerText = name;

      const compCode = document.createElement("p");
      compCode.innerText = `code: ${code}`;

      const compDomain = document.createElement("p");
      compDomain.innerText = `domain: ${domain}`;

      const singleCompanyElement = document.createElement("div");
      singleCompanyElement.classList.add("company-search-element");

      singleCompanyElement.append(compName, compCode, compDomain);

      searchResults.appendChild(singleCompanyElement);
    });
  }, 300);
});
// END OF THE FIRST FUNCTIONALIY: THE SEARCH BAR

// SECOND FUNCTIONALITY: THE DOWNLOAD
let aTag = document.querySelector("a");

// A function which modifies the list of customers.
// In case of each customer, the list of companies is browsed
// to find the company with the code matching to the single
// customer's companyCode. Then, the customer object gets an
// appropriate company object added as value to his new
// "company" key. The original list of customers
// is unchanged because a copy is made in the process.
const generateUserList = async () => {
  const { customers, companies } = await data;
  const customersArray = [...customers];
  customersArray.forEach((customer) => {
    const { companyCode } = customer;
    const filteredCompany = companies.find((company) => {
      return company.code === companyCode;
    });
    customer.company = filteredCompany;
  });
  return customersArray;
};

// This function takes the modified list of customers and
// is turned into JSON format, then processed into BLOB
// and provided to the anchor tag to be downloaded.
const generateBlob = async () => {
  let blob = new Blob([JSON.stringify(await generateUserList())], {
    type: "application/json;charset=utf-8",
  });
  let url = window.URL;
  let link = url.createObjectURL(blob);
  aTag.href = link;
};

generateBlob();

// END OF SECOND FUNCTIONALITY: THE DOWNLOAD

// THIRD FUNCTIONALITY: VERIFY PHONE NUMBER
const verifyNumberForm = document.forms["verify-number"];

const verifyNumberInput =
  document.forms["verify-number"].querySelector("input");

const verifyNumberFormSmall =
  document.forms["verify-number"].querySelector("small");

const verifyNumberButton = document.querySelector(".verify-number-btn");

// Accepted formats:
// +1234-567-890-123
// +123-456-789-012
// +12-345-678-901
// +1-234-567-890
// The first term allows to enter 1-4 digits as there exist such
// locations where the area code needs 1 or 2 or 3 or 4 digits
const regex = /[\+]{1}[0-9]{1,4}-[0-9]{3}-[0-9]{3}-[0-9]{3}/;

verifyNumberForm.addEventListener("submit", (e) => {
  e.preventDefault();
  return;
});

const feedback = document.createElement("small");

// A function to insert an element before an existing one
const insertBefore = (newNode, existingNode) => {
  existingNode.parentNode.insertBefore(newNode, existingNode);
};

// When the phone number in a correct format has been written into the input
// there is a positive feedback message given and the input window changes its style.
// By analogy, a negative feedback is given when the phone number is of an incorrect format.
verifyNumberButton.addEventListener("click", () => {
  const verifyResult = regex.test(verifyNumberInput.value);
  if (verifyResult) {
    feedback.innerText = "Your phone number has got the correct format";
    insertBefore(feedback, verifyNumberFormSmall);
    verifyNumberInput.classList.remove("wrong-format");
    verifyNumberInput.classList.add("correct-format");
  } else {
    feedback.innerText = "Incorrect format of the phone number";
    insertBefore(feedback, verifyNumberFormSmall);
    verifyNumberInput.classList.remove("correct-format");
    verifyNumberInput.classList.add("wrong-format");
  }
});

// END OF THIRD FUNCTIONALITY: VERIFY PHONE NUMBER
