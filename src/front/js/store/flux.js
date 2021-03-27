const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			login: [],
			users: [],
			message: {}
		},

		actions: {
			setLogin: user => {
				fetch("https://3001-coral-amphibian-ubxv67se.ws-us03.gitpod.io" + "/api/login", {
					method: "POST",
					body: JSON.stringify(user),
					headers: { "Content-type": "application/json" }
				})
					.then(resp => resp.json())
					.then(data => {
						console.log("--data--", data);
						setStore({ login: data });
						if (typeof Storage !== "undefined") {
							console.log(data.token, "---> data.token");
							localStorage.setItem("token", data.token);
							localStorage.setItem("user", JSON.stringify(data.user));
							localStorage.setItem("username", JSON.stringify(data.username));
						} else {
							// LocalStorage no soportado en este navegador
							alert("Lo sentimos, tu navegador no es compatible.");
						}
					})
					.catch(error => console.log("Error loading message from backend", error));
			},

			getToken: () => {
				const tokenLocal = localStorage.getItem("token");
				const userLocal = JSON.parse(localStorage.getItem("user"));
				const usernameLocal = JSON.parse(localStorage.getItem("username"));
				setStore({
					login: {
						token: tokenLocal,
						user: userLocal,
						username: usernameLocal
					}
				});
				console.log("-->", tokenLocal);
				console.log("-->", JSON.stringify(userLocal));
			},

			sendContactMsg: (name, email, message) => {
				fetch("https://kp0p375mk2.execute-api.sa-east-1.amazonaws.com/default/contactanos", {
					method: "POST",
					body: JSON.stringify({
						senderName: name,
						senderEmail: email,
						senderMessage: message
					}),
					headers: { "Content-type": "application/json" }
				})
					.then(resp => {
						if (!resp.ok) throw new Error("Error in fetch");
						return response.json();
					})
					.then(resp => {
						console.log("Email sent");
					})
					.catch(error => {
						console.log("Unexpected error");
					});
			}
		}
	};
};

export default getState;
