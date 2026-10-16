// Shared helper functions used by several of the example pages.

// Send an SQL query to dbConnector.php and return the JSON response.
const runQuery = async (sql) => {
  try {
    // This is the PHP endpoint that talks to the database for us.
    const url = "https://oreel03.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

    // Send the SQL statement in the body of a POST request.
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams({ query: sql })
    });

    // Stop and report a problem if the web request itself failed.
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    // Convert the JSON text from PHP into a JavaScript object.
    const result = await response.json();
    return result;

  } catch (error) {
    // Log errors so they can be seen in the browser console during debugging.
    console.log(error.message);
  }
}

// Check that a donation object contains valid values before using it in SQL.
const validateDonation = (donation) => {
  if (!donation || typeof donation !== "object") {
    return "donation details are required.";
  }

  // Clean up and convert values first so the checks below are easier to write.
  const donationDate = typeof donation.donationDate === "string" ? donation.donationDate.trim() : "";
  const amountDonated = Number(donation.amountDonated);
  const paymentMethod = typeof donation.paymentMethod === "string" ? donation.paymentMethod.trim() : "";
  const memberID = Number(donation.memberID);
  const fundraiserID = Number(donation.fundraiserID);

  // Check each field one at a time and return the first message that applies.
  if (!donationDate) {
    return "date is required.";
  }

  if(donationDate) {
    const parseDate = new Date(donationDate);
    if (isNaN(parseDate.getTime())) {
      return "Must be a valid date!";
    }
  }
   if (!amountDonated) {
    return "amount is required.";
  }

  if (!Number.isInteger(amountDonated) || amountDonated < 0) {
    return "donation must be a whole number greater than 0.";
  }

  if (!Number.isInteger(memberID) || memberID < 0) {
    return "member ID must be a whole number greater than 0.";
  }
   if (!Number.isInteger(fundraiserID) || fundraiserID < 0) {
    return "fundraiser ID must be a whole number greater than 0.";
  }



  if (!paymentMethod) {
    return "payment method is required.";
  }

  const allowedTypes = ["Cash", "Card", "Bank Transfer", "Other"];
  if(!allowedTypes.includes(paymentMethod)) {
    return " Payment method. must be Cash, Card, Bank Transfer or Other"
  }



  // An empty string means every check passed.
  return "";
}

// Replace single quotes with two single quotes so they are safer inside SQL strings.
// /'/g means "find every single quote in the text" (g = global, so not just the first one).
const escapeSql = (value) => {
  return value.replace(/'/g, "''");
}
