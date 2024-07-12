async function updateExperienceTotal(executionContext) {
    var formContext = executionContext.getFormContext();
    var savedContactWorkExperiance = formContext.getAttribute("cre76_workexperience");
    var accountIdObject = formContext.getAttribute("parentcustomerid");
    var savedContactFullName = formContext.getAttribute("fullname");

    if (savedContactWorkExperiance && savedContactWorkExperiance.getIsDirty()) {
            if (accountIdObject) {
                var accountId = accountIdObject.getValue()[0].id;
                accountId = accountId.replace("{", "").replace("}", "");

                // Get all bound contacts
                var fetchXml = [
                    "<fetch>",
                    "  <entity name='contact'>",
                    "    <attribute name='fullname'/>",
                    "    <attribute name='cre76_workexperience'/>",
                    "    <filter>",
                    "      <condition attribute='parentcustomerid' operator='eq' value='", accountId, "'/>",
                    "    </filter>",
                    "  </entity>",
                    "</fetch>"
                ].join("");

                try {
                    var result = await Xrm.WebApi.retrieveMultipleRecords("contact", "?fetchXml=" + encodeURIComponent(fetchXml));
                    var totalExperience = result.entities.reduce((sum, contact) => {
                        if(contact.fullname === savedContactFullName.getValue())
                            return sum + savedContactWorkExperiance.getValue();
                        return sum + (contact.cre76_workexperience || 0);
                    }, 0);
                
                    var accountUpdate = {
                        cre76_experiencetotal: totalExperience
                    };

                    await Xrm.WebApi.updateRecord("account", accountId, accountUpdate);
                } catch (error) {
                    console.error("Error updating Experience Total: ", error.message);
                }
            } else {
                console.error("CompanyName attribute is missing or has no value.");
            }
    } else {
        console.error("WorkExperience attribute is missing or it is not dirty.");
    }
}

function refreshExperienceTotal(primaryControl){
    var formContext = primaryControl;
    var accountId = formContext.data.entity.getId();

    if(!accountId){
        console.log("Account Id is missing");
        return;
    }
    accountId = accountId.replace("{","").replace("}","");

    Xrm.WebApi.retrieveRecord("account", accountId, "?$select=cre76_experiencetotal").then(
        function succes(result){
            var experienceTotal = result.cre76_experiencetotal;
            formContext.getAttribute("cre76_experiencetotal").setValue(experienceTotal);
            formContext.data.entity.save();
            console.log("Experience Total updated successfully.");
        },
        function (error){
            console.log("Error retrieving account: " + error.message);
        }
    )
}