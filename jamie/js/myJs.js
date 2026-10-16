const runQuery = async (sql) => {
  try {
    // This is the PHP file that receives the SQL and talks to the database.
    const url = "https://jkilleen02.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

    // Send the SQL to PHP as form data in a POST request.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "query=" + encodeURIComponent(sql)
    });

    // Throw an error if the web request itself failed.
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    // Convert the JSON text from the server into a JavaScript object.
    const result = await response.json();
    console.log(result);
    return result;

  } catch (error) {
    // Log the error so it can be inspected in the browser console.
    console.log(error.message);
  }
}
const validateMember = (member) => {
  if (!member || typeof member !== "object") {
    return "Member Details REQUIRED";
  }

  const memberFirstName = typeof member.memberFirstName === "string" ? member.memberFirstName.trim() : "";
  const memberLastName = typeof member.memberLastName === "string" ? member.memberLastName.trim() : "";
  const memberPhoneNo = typeof member.memberPhoneNo === "string" ? member.memberPhoneNo.trim() : "";
  const memberEmail = typeof member.memberEmail === "string" ? member.memberEmail.trim() : "";
  const memberHouseNumber = Number(member.memberHouseNumber);
  const memberStreet = typeof member.memberStreet === "string" ? member.memberStreet.trim() : "";
  const memberTown = typeof member.memberTown === "string" ? member.memberTown.trim() : "";
  const memberDOB = typeof member.memberDOB === "string" ? member.memberDOB.trim() : "";
  const membershipType = typeof member.membershipType === "string" ? member.membershipType.trim() : "";
  //

  if (!memberFirstName) {
    return "First Name REQUIRED!"
  }
  if (memberFirstName.length > 50) {
    return "First Name must be 50 characters of less!";
  }
  if (!memberLastName) {
    return "Last Name REQUIRED!";
  }
  if (memberLastName.length > 50) {
    return "Last Name must be 50 characters or less!";
  }
  if (memberPhoneNo.length > 20) {
    return "Phone Number must be 20 characters or less!";
  }
  if (!memberEmail) {
    return "Email REQUIRED!";
  }
  if (memberEmail.length > 100) {
    return "Email must be 100 characters or less!";
  }
  if (memberHouseNumber && (!Number.isInteger(memberHouseNumber) || memberHouseNumber < 1)) {
    return "House Number must be a whole number above 0!";
  }
  if (memberStreet.length > 100) {
    return "Street Name must be 100 characters or less!";
  }
  if (memberTown.length > 50) {
    return "Town Name must be 50 characters or less!";
  }
  if (memberDOB) {
    const parsedDOB = new Date(memberDOB);
    if (isNaN(parsedDOB.getTime())) {
      return "Date of Birth must be a valid date!";
    }
  }
  const allowedTypes = ["Member", "Volunteer"];
  if (!allowedTypes.includes(membershipType)) {
    return "Membership Type must be Member or Volunteer!";
  }
  return "";
}
const validateAdoption = (adoption) => {
  if (!adoption || typeof adoption !== "object") {
    return "Adoption Details REQUIRED";
  }

  const adoptionFee = Number(adoption.adoptionFee);
  const animalID = Number(adoption.animalID);
  const adoptionStatus = typeof adoption.adoptionStatus === "string" ? adoption.adoptionStatus.trim() : "";
  const memberID = Number(adoption.memberID);
  const adoptionDate = typeof adoption.adoptionDate === "string" ? adoption.adoptionDate.trim() : "";
  //
  if (!adoptionFee) {
    return "Adoption Fee REQUIRED!"
  }
  if (!animalID) {
    return "AnimalID REQUIRED!"
  }
  if (!adoptionStatus) {
    return "Adoption Status REQUIRED!"
  }
  if (!memberID) {
    return "MemberID REQUIRED!"
  }
  const allowedTypes = ["Pending", "Approved", "Rejected", "Complete"];
  if (!allowedTypes.includes(adoptionStatus)) {
    return "Adoption Status must be Pending, Approved, Rejected or Complete!";
  }
  if (adoptionDate) {
    const parsedDOB = new Date(adoptionDate);
    if (isNaN(parsedDOB.getTime())) {
      return "Adoption Date must be a valid date!";
    }
  }

}
const escapeSql = (value) => {
  return value.replace(/'/g, "''");
}