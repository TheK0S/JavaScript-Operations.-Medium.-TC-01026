function openAssociateContactDialog(primaryControl) {
    var accountId = primaryControl.data.entity.getId();

    var pageInput = {
        pageType: "webresource",
        webresourceName: "new_AssociateContactPage.html",
        data: accountId
    };

    var navigationOptions = {
        target: 2,
        width: 600,
        height: 600,
        position: 1
    };

    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
        function success() {
            Xrm.Page.data.refresh(true);
        },
        function error() {
            console.log("Failed to open dialog.");
        }
    );
}