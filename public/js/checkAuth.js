const tocken = localStorage.getItem("jwtTocken");

async function checkAuth() {
    fetch("/api/check-auth", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + tocken,
        }),
        body: {},
      }).then((res) => {
        return res.json();
      }).then((data) => {
        if (!data.login) {
            window.location.href = "/auth";
        }
      }).catch((err) => {
        window.location.href = "/auth";
      })
}

if (tocken) {
    checkAuth();
} else {
  window.location.href = "/auth";
}
