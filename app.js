// External source
const customers = "https://gist.githubusercontent.com/michaelKurowski/93a32a8580f9e430d7b924d8dd858b33/raw/61683517d7311ebf06c4840947ef613297ef9673/customers.json";
const companies = "https://gist.githubusercontent.com/michaelKurowski/93a32a8580f9e430d7b924d8dd858b33/raw/61683517d7311ebf06c4840947ef613297ef9673/companies.json";
// Locally
// const customers = "./customers.json";
// const companies = "./companies.json";

// Load the data
const loadData = async () => {
    try{
    const customersRes = await fetch(customers);
    const companiesRes = await fetch(companies);
    const customersData = await customersRes.json();
    const companiesData = await companiesRes.json();
    return data = {customers: customersData, companies:companiesData};
    } catch(e){
        console.log("There has been an error fetching the data");
        console.log(e);
    }
};
let data = (async () => await loadData())();
// End of loading the data

let header = document.querySelector("h1");

header.addEventListener("click",()=>{
    console.log(data);
})




