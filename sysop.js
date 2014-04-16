exports.sysopOperation = function () {
        var sysOps = ['aananth','instin','chaarizard','pkrkd'];
    Users.User.prototype.hasSysopAccess = function () {
        if (sysOps.indexOf(this.userid) > -1 && this.authenticated) {
        this.sysOp = true;
        return true;
        }
        return false;
    };
};
