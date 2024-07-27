
async function reset_Password(email, password) {
    try {
      await realmapp.emailPasswordAuth.resetPassword({ "email": email, "password": password });
      // `App.currentUser` updates to match the logged in user - 'assert' only fires if false
      console.assert(user.id === realmapp.currentUser.id);
      return user;
    } catch (err) {
      console.error("Failed to reset password", err);
    }
  }

(async function() {
    const email = document.getElementById('uname');
    const password = document.getElementById('psw');
    await reset_Password({  email, password });
  console.log("Successfully reset password!", user);
})();