// External source
const customers =
  "https://gist.githubusercontent.com/michaelKurowski/93a32a8580f9e430d7b924d8dd858b33/raw/61683517d7311ebf06c4840947ef613297ef9673/customers.json";
const companies =
  "https://gist.githubusercontent.com/michaelKurowski/93a32a8580f9e430d7b924d8dd858b33/raw/61683517d7311ebf06c4840947ef613297ef9673/companies.json";
// Locally
// const customers = "./customers.json";
// const companies = "./companies.json";

const loadData = async () => {
  try {
    const customersResult = await fetch(customers);
    const companiesResult = await fetch(companies);
    const arrayOfAllCustomers = await customersResult.json();
    const arrayOfAllCompanies = await companiesResult.json();
    return { customers: arrayOfAllCustomers, companies: arrayOfAllCompanies };
  } catch (err) {
    console.log(err);
    console.log("There has been an error fetching the data");
  }
};

const alertWhenDataIsLoaded = async () => {
  const fullDataLoaded = await loadData();
  console.log("The data has been loaded");
  console.log(fullDataLoaded);
  alert("The data has been loaded");
};

alertWhenDataIsLoaded();

// FIRST FUNCTIONALIY: THE SEARCH BAR
const searchBar = document.forms["search-companies"].querySelector("input");
const searchResults = document.getElementsByClassName(
  "company-search-results"
)[0];

const isSubstringInside = (str, substr) => {
  return str.toLowerCase().indexOf(substr.toLowerCase()) > -1 ? true : false;
};

const createSingleResultAndAppend = (
  foundName,
  foundCode,
  foundDomain,
  list
) => {
  const compName = document.createElement("h2");
  compName.innerText = foundName;

  const compCode = document.createElement("p");
  compCode.innerText = `code: ${foundCode}`;

  const compDomain = document.createElement("p");
  compDomain.innerText = `domain: ${foundDomain}`;

  const singleCompanyElement = document.createElement("div");
  singleCompanyElement.classList.add("company-search-element");
  singleCompanyElement.append(compName, compCode, compDomain);

  list.appendChild(singleCompanyElement);
};

searchBar.addEventListener("keyup", async (e) => {
  e.preventDefault();
  let timeout = null;
  const fullDataLoaded = await loadData();
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    searchResults.innerHTML = "";

    const matchingCompanies = fullDataLoaded.companies.filter((company) => {
      if (e.target.value.length < 3) {
        return;
      }
      return isSubstringInside(company.name, e.target.value);
    });

    matchingCompanies.slice(0, 10).map((singleCompany) => {
      const { name, code, domain } = singleCompany;
      createSingleResultAndAppend(name, code, domain, searchResults);
    });
  }, 300);
});

// SECOND FUNCTIONALITY: THE DOWNLOAD
let aTag = document.querySelector("a");

const generateUserList = async () => {
  const fullDataLoaded = await loadData();
  const { customers, companies } = fullDataLoaded;
  customers.forEach((customer) => {
    const { companyCode: customersCompanyCode } = customer;
    const filteredCompany = companies.find(
      (company) => company.code === customersCompanyCode
    );
    customer.company = filteredCompany;
  });
  return customers;
};

const generateBlob = async () => {
  let blob = new Blob([JSON.stringify(await generateUserList())], {
    type: "application/json;charset=utf-8",
  });
  let url = window.URL;
  let link = url.createObjectURL(blob);
  aTag.href = link;
};

generateBlob();

// THIRD FUNCTIONALITY: VERIFY PHONE NUMBER
const verifyNumberForm = document.forms["verify-number"];
const verifyNumberButton = document.querySelector(".verify-number-btn");
const verifyNumberInput =
  document.forms["verify-number"].querySelector("input");
const numberFormatMessage = document.getElementById("feedback");
const regex = /[\+]{1}[0-9]{1,4}-[0-9]{3}-[0-9]{3}-[0-9]{3}$/;

const feedbackText = document.createElement("small");

const insertBefore = (newNode, existingNode) => {
  existingNode.parentNode.insertBefore(newNode, existingNode);
};

verifyNumberForm.addEventListener("submit", (e) => {
  e.preventDefault();
  return;
});

verifyNumberButton.addEventListener("click", () => {
  const verifyResult = regex.test(verifyNumberInput.value);
  if (!verifyResult) {
    feedbackText.innerText = "Incorrect format of the phone number";
    insertBefore(feedbackText, numberFormatMessage);
    verifyNumberInput.setAttribute("class", "wrong-format");
    return;
  }
  feedbackText.innerText = "Your phone number has got the correct format";
  insertBefore(feedbackText, numberFormatMessage);
  verifyNumberInput.setAttribute("class", "correct-format");
});
