const getState = ({ getStore, setStore }) => {
	return {
		store: {
			conditions: [],
			login: [],
			users: [],
			observations: {},
			pets: {},
			petById: {},
			vaccines: {}
		},

		actions: {
			setLogin: user => {
				fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					body: JSON.stringify(user),
					headers: { "Content-type": "application/json" }
				})
					.then(resp => resp.json())
					.then(data => {
						setStore({ login: data });
						if (typeof Storage !== "undefined") {
							localStorage.setItem("token", data.token);
							localStorage.setItem("user", JSON.stringify(data.user));
							localStorage.setItem("first_name", JSON.stringify(data.first_name));
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
				const firstNameLocal = JSON.parse(localStorage.getItem("first_name"));
				setStore({
					login: {
						token: tokenLocal,
						user: userLocal,
						firstName: firstNameLocal
					}
				});
				console.log("tokenLocal -->", tokenLocal);
				console.log("userLocal -->", JSON.stringify(userLocal));
			},

			sendContactMsg: (name, email, message, role) => {
				fetch("https://kp0p375mk2.execute-api.sa-east-1.amazonaws.com/default/contactanos", {
					method: "POST",
					body: JSON.stringify({
						senderName: name,
						senderEmail: email,
						senderMessage: message,
						senderRole: role
					})
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
			},

			registerUser: user => {
				fetch(process.env.BACKEND_URL + "/api/register", {
					method: "POST",
					body: JSON.stringify(user),
					headers: { "Content-type": "application/json" }
				})
					.then(response => response.json())
					.then(data => {
						setStore({ user: data });
					})
					.catch(error => {
						console.log(error);
					});
			},

			getPetById: id => {
				fetch(`https://fhir.cens.cl/baseR4/Patient?identifier=${parseInt(id)}`, {
					method: "GET",
					headers: { "Content-type": "application/json" }
				})
					.then(response => response.json())
					.then(data => {
						const dataPets = {
							id: data.entry[0].resource.id,
							name: data.entry[0].resource.name[0].given[0],
							species:
								data.entry[0].resource.extension[0].extension[0].valueCodeableConcept.coding[0].display,
							breed:
								data.entry[0].resource.extension[0].extension[1].valueCodeableConcept.coding[0].display,
							gender: data.entry[0].resource.gender,
							birthDate: data.entry[0].resource.birthDate
						};
						setStore({ petById: dataPets });
						setStore({ haveTheData: true });
					})
					.catch(error => console.log(error));
			},

			getCondition: id => {
				fetch(`https://fhir.cens.cl/baseR4/Condition/ENF-${id}`, {
					method: "GET",
					headers: { "Content-type": "application/json" }
				})
					.then(response => response.json())
					.then(data => {
						const store = getStore();
						const condition = data.code.coding[0].display;
						setStore({ conditions: [...store.conditions, condition] });
					});
			},

			getObservation: id => {
				fetch(`https://fhir.cens.cl/baseR4/Observation/INF-${id}`, {
					method: "GET",
					headers: { "Content-type": "application/json" }
				})
					.then(response => response.json())
					.then(data => {
						const lastUpdate = data.meta.lastUpdated.split("T");
						const obsData = {
							update: lastUpdate[0],
							weight: data.valueQuantity.value + " " + data.valueQuantity.unit
						};
						setStore({ observations: obsData });
					});
			},

			getVaccines: id => {
				fetch(`https://fhir.cens.cl/baseR4/Immunization/VAC-${id}`, {
					method: "GET",
					headers: { "Content-type": "application/json" }
				})
					.then(response => response.json())
					.then(data => {
						const vaccine = {
							vaccine: data.vaccineCode.text,
							date: data.occurrenceDateTime
						};
						setStore({ vaccines: vaccine });
					});
			},

			getPetInformation: pets => {
				fetch(`https://fhir.cens.cl/baseR4/Patient/PET-${pets}`, {
					method: "GET",
					headers: { "Content-type": "application/json" }
				})
					.then(response => response.json())
					.then(data => {
						const dataPets = {
							name: data.name[0].given[0],
							identifier: data.identifier[0].value,
							gender: data.gender,
							birthDate: data.birthDate,
							species: data.extension[0].extension[0].valueCodeableConcept.coding[0].display,
							breed: data.extension[0].extension[1].valueCodeableConcept.coding[0].display,
							genderStatus: data.extension[0].extension[2].valueCodeableConcept.coding[0].code,
							petOwner_name: data.contact[0].name.given[0],
							petOwner_father: data.contact[0].name.extension[0].valueString,
							petOwner_mother: data.contact[0].name.extension[1].valueString,
							address: data.contact[0].address.line[0],
							phone: data.contact[0].telecom[0].value,
							email: data.contact[0].telecom[1].value
						};
						setStore({ pets: dataPets });
					})
					.catch(error => {
						console.log(error);
					});
			},

			createNewPet: (
				name,
				identifier,
				gender,
				birthDate,
				species,
				breed,
				genderStatus,
				petOwner_name,
				petOwner_mother,
				petOwner_father,
				address,
				phone,
				email
			) => {
				const newPet = {
					resourceType: "Patient",
					extension: [
						{
							url: "http://hl7.org/fhir/StructureDefinition/patient-animal",
							extension: [
								{
									url: "species",
									valueCodeableConcept: {
										coding: [
											{
												system: "http://hl7.org/fhir/animal-species",
												display: species
											}
										]
									}
								},
								{
									url: "breed",
									valueCodeableConcept: {
										coding: [
											{
												system: "http://snomed.info/sct",
												display: breed
											}
										]
									}
								},
								{
									url: "genderStatus",
									valueCodeableConcept: {
										coding: [
											{
												system: "http://hl7.org/fhir/animal-genderstatus",
												code: genderStatus
											}
										]
									}
								}
							]
						}
					],
					identifier: [
						{
							type: { text: "CHIP identifier" },
							system: "https://registratumascota.cl",
							value: identifier
						}
					],
					name: [{ given: name }],
					gender: gender,
					birthDate: birthDate,
					contact: [
						{
							name: {
								extension: [
									{
										url: "http://hl7.org/fhir/StructureDefinition/humanname-father-family",
										valueString: petOwner_father
									},
									{
										url: "http://hl7.org/fhir/StructureDefinition/humanname-mothers-family",
										valueString: { petOwner_mother }
									}
								],
								given: petOwner_name
							},
							telecom: [
								{ system: "phone", value: phone, use: "work" },
								{ system: "email", value: email }
							],
							address: { line: [address] }
						}
					]
				};
				fetch("https://fhir.cens.cl/baseR4/Patient", {
					method: "POST",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify(newPet)
				})
					.then(resp => resp.json())
					.then(resp => {
						console.log("New pet has been created");
						setStore({ pets: dataPets });
					})
					.catch(error => {
						console.log("Unexpected error");
					});
			}
		}
	};
};

export default getState;
