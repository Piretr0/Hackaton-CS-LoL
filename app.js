const express = require("express");
const app = express();
const userRouter = require("./routes/student");
const userRouter3 = require("./routes/srednie");
const userRouter5 = require("./routes/faq");
const userRouter6 = require("./routes/kontakt");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const adminRouter = require("./routes/adminPage");
const detailsRouter = require("./routes/details");
const usnieteRouter = require("./routes/usuniete");
const selectGame = require("./routes/selectGame");
const drabinkaLoL = require("./routes/drabinkaLoL");
const drabinkaCS = require("./routes/drabinkaCS");
const testRouter = require("./routes/test");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const CLIENT_ID =
    "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "";
const REFRESH_TOKEN =
    "";

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const cookieParser = require("cookie-parser");
const session = require("express-session");
const ONE_HOUR = 1000 * 60 * 60;

// const port = process.env.PORT || 8080;
const port = process.env.PORT || 3000;
app.set("port", port);

app.use(
    session({
        secret: "admin",
        resave: false,
        saveUnitialized: false,
        cookie: {
            maxAge: ONE_HOUR,
        },
    })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + "/public/stylesheets"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public/javasctipts"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("index");
});
app.use("/student", userRouter);

app.use("/srednie", userRouter3);
app.use("/faq", userRouter5);
app.use("/kontakt", userRouter6);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/adminPage", adminRouter);
app.use("/details", detailsRouter);
app.use("/usuniete", usnieteRouter);
app.use("/selectGame", selectGame);
app.use("/drabinkaLoL", drabinkaLoL);
app.use("/drabinkaCS", drabinkaCS);
app.use("/test", testRouter);


const db = require("./models");
const { user } = require("./models");
const { register } = require("./models");
const { grupy } = require("./models");
const { bracketTournament } = require("./models");
const { bracketTournamentLoL } = require("./models");
const { bracketTournamentCS } = require("./models");
const { where } = require("sequelize/dist");


db.sequelize.sync().then((req) => {
    app.listen(3000, () => {
        console.log("Serwer uruchomiony");
    });
    // app.listen(8080, () => {
    //     console.log("Serwer uruchomiony");
    // });
});

app.post("/adminPage/register", async(req, res) => {
    const loginadmin = req.body.login;
    //const checklogin = await register.findOne({ where: { login: loginadmin } });
    const transaction = await db.sequelize.transaction();
    try {
        const checklogin = await register.findOne({
            where: { login: loginadmin },
        }, {
            transaction,
        });
        await transaction.commit();
        //---
        const transaction2 = await db.sequelize.transaction();
        if (checklogin === null) {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                register
                    .create({
                        login: req.body.login,
                        password: hashedPassword,
                        edit: 0,
                        add: 0,
                        delete: 0,
                        power: 0,
                        active: 0,
                    }, {
                        transaction2,
                    })
                    .then(function(register) {
                        if (register) {
                            res.render("register.ejs", {
                                message2: "Pomyślne dodanie do bazy...",
                            });
                        } else {
                            res.render("register.ejs", { message: "Błąd przy dodawaniu..." });
                        }
                    })
                    .then(async(x) => {
                        await transaction2.commit();
                    });
            } catch {
                await transaction2.rollback();
                res.redirect("/adminPage/register");
            }
        } else {
            res.render("register.ejs", { message: "Taki login już istnieje..." });
        }
        //---
    } catch (error) {
        await transaction.rollback();
    }
});

app.post("/login", async(req, res) => {
    const { login, password } = req.body;
    try {
        const admin = await register.findOne({ where: { login } });
        if (await bcrypt.compare(password, admin.password)) {
            req.session.admin = true;
            req.session.yId = admin.id
            res.redirect("/adminPage");
        } else {
            res.render("login.ejs", { message: "Niepoprawne login lub hasło..." });
        }
    } catch {
        res.render("login.ejs", { message: "Niepoprawne login lub hasło..." });
    }
});

app.post("/adminPage-delete-:id", async(req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        if (req.session.delete == 1) {
            user
                .update({
                    active: 0,
                }, {
                    where: {
                        grupyid: req.params.id,
                    },
                }, {
                    transaction,
                })
                .then(async(x) => {
                    await transaction.commit();
                })
                .then(async(x) => {
                    const transaction = await db.sequelize.transaction();
                    try {
                        grupy
                            .update({
                                active: 0,
                            }, {
                                where: {
                                    id: req.params.id,
                                },
                            }, {
                                transaction,
                            })
                            .then((note) => res.redirect("/adminPage"))
                            .then(async(x) => {
                                await transaction.commit();
                            });
                    } catch {
                        await transaction.rollback();
                    }
                });
        }
    } catch {
        await transaction.rollback();
    }
});

app.post("/adminPage-back-:id", async(req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        user
            .update({
                active: 1,
            }, {
                where: {
                    grupyid: req.params.id,
                },
            }, {
                transaction,
            })
            .then(async(x) => {
                await transaction.commit();
            })
            .then(async function(x) {
                const transaction = await db.sequelize.transaction();
                try {
                    grupy
                        .update({
                            active: 1,
                        }, {
                            where: {
                                id: req.params.id,
                            },
                        }, {
                            transaction,
                        })
                        .then((note) => res.redirect("/usuniete"))
                        .then(async(x) => {
                            await transaction.commit();
                        });
                } catch {
                    await transaction.rollback();
                }
            });
    } catch {
        await transaction.rollback();
    }
});

app.post("/adminPage-usun-:id", async(req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        grupy
            .destroy({
                where: {
                    id: req.params.id,
                },
            }, {
                transaction,
            })
            .then((note) => res.redirect("/usuniete"))
            .then(async(x) => {
                await transaction.commit();
            });
    } catch {
        await transaction.rollback();
    }
});

app.post("/adminPage-usunAll", async(req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        grupy
            .destroy({
                where: {
                    active: 0,
                },
            }, {
                transaction,
            })
            .then((note) => res.redirect("/usuniete"))
            .then(async(x) => {
                await transaction.commit();
            });
    } catch {
        await transaction.rollback();
    }
});

app.post("/adminPage/details-:id", async(req, res) => {
    const grupa = await grupy.findOne({ where: { id: req.params.id } });
    const grupies = await user
        .findAll({
            where: { grupyId: req.params.id },
        })
        .then((user) => {
            res.render("details", {
                user,
                grupa,
            });
        });

});

app.post("/update-:id", function(req, res) {
    grupy
        .update({
            nazwaZespolu: req.body.teamname,
            nazwaSzkoly: req.body.schoolname,
            stopienSzkoly: req.body.schoollevel,
        }, {
            where: { id: req.params.id },
        })
        .then(function(x) {
            for (var i = 1; i < 6; i++) {
                user.update({
                    imie: eval("req.body.imie" + i),
                    nazwisko: eval("req.body.nazwisko" + i),
                    email: eval("req.body.email" + i),
                    index: eval("req.body.index" + i),
                }, {
                    where: {
                        id: eval("req.body.userId" + i),
                    },
                });
            }
        });
    res.redirect("/adminPage");
});

app.post("/adminPage/admindetails", async(req, res) => {
    const checklogin = await register.findOne({
        where: { login: req.body.loginchange },
    });
    if (checklogin == null) {
        register.update({
            login: req.body.loginchange,
        }, {
            where: {
                login: req.session.nick,
            },
        });
        res.render("admindetails.ejs", { message: "Pomyślna zmiana loginu..." });
    } else {
        res.render("admindetails.ejs", { message2: "Taki login już istnieje..." });
    }
});

app.post("/adminPage/admindetails2", async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.passchange, 10);
    if (req.body.passchange == req.body.passchange2) {
        register.update({
            password: hashedPassword,
        }, {
            where: {
                login: req.session.nick,
            },
        });
        res.render("admindetails.ejs", { message: "Pomyślna zmiana hasła..." });
    } else
        res.render("admindetails.ejs", { message2: "Hasła się nie zgadzają..." });
});

app.post("/deleteadminacc", async(req, res) => {
    register.destroy({
        where: {
            login: req.session.nick,
        },
    });
    req.session.destroy();
    res.redirect("/login");
});

app.post("/admins-delete-:id", async(req, res) => {
    await register.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.redirect("/adminPage/admins");
});

app.post("/admins-addedit-:id", async(req, res) => {
    await register.update({ edit: 1 },

        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.redirect("/adminPage/admins");
});
app.post("/admins-takeedit-:id", async(req, res) => {
    await register.update({ edit: 0 },

        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.redirect("/adminPage/admins");
});
app.post("/admins-adddelete-:id", async(req, res) => {
    await register.update({ delete: 1 },

        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.redirect("/adminPage/admins");
});
app.post("/admins-takedelete-:id", async(req, res) => {
    await register.update({ delete: 0 },

        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.redirect("/adminPage/admins");
});
app.post("/admins-addadd-:id", async(req, res) => {
    await register.update({ add: 1 },

        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.redirect("/adminPage/admins");
});
app.post("/admins-takeadd-:id", async(req, res) => {
    await register.update({ add: 0 },

        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.redirect("/adminPage/admins");
});

app.post("/postteam", async(req, res) => {
    const gra = req.body.selectGame;
    console.log("select gra QQQQQQQQQQQQQQQQQQQQ")
    console.log(gra)
    const data = { message: 'Pomyślne zapisanie drużyny :)' };
    const school = req.body.schoollevel;
    const groupname = req.body.teamname;
    const checkgroup = await grupy.findOne({
        where: { nazwaZespolu: groupname },
    });
    var gra_CS_Zapis = 0
    var gra_LOL_Zapis  = 0
    
    if(gra == "CS"){
        gra_CS_Zapis = 1
    }
    if(gra == "LoL"){
        gra_LOL_Zapis = 1
    }
    if(gra == ""){
        console.log("select gra Brak")
        console.log(gra)
        return res.json({ ErrorMessage: "Nie wybrano gry" });
    }

    if ((await checkgroup) == null) {
        // const transaction = await db.sequelize.transaction();
        try {
            await db.sequelize.transaction(async function(t) {
                await grupy
                    .create({
                        nazwaZespolu: req.body.teamname,
                        nazwaSzkoly: req.body.schoolname,
                        stopienSzkoly: req.body.schoollevel,
                        active: 1,
                        gra_LOL: gra_LOL_Zapis,
                        gra_CS: gra_CS_Zapis,
                    }, {
                        transaction: t,
                    })
                    .then(async function(x) {

                        // const accessToken = await oAuth2Client.getAccessToken();

                        // const transport = nodemailer.createTransport({
                        //     service: 'gmail',
                        //     auth: {
                        //         type: 'OAuth2',
                        //         user: '',
                        //         clientId: CLIENT_ID,
                        //         clientSecret: CLIENT_SECRET,
                        //         refreshToken: REFRESH_TOKEN,
                        //         accessToken: accessToken,
                        //     },
                        //     tls: {
                        //         rejectUnauthorized: false
                        //     }
                        // });

                        // const mailOptions = {
                        //     from: 'HackatonANS <>',
                        //     to: req.body.email1,
                        //     subject: 'Hackaton Zapisy',
                        //     text: "Hej " + req.body.imie1 + ", informuję, że twój zapis drużyny " + req.body.teamname + " przeszedł pomyślnie, powodzenia :)",
                        // };

                        // await transport.sendMail(mailOptions);


                        let groupid = x.id;

                        const itemArray = [];
                        encja1 = {
                            imie: req.body.imie1,
                            nazwisko: req.body.nazwisko1,
                            email: req.body.email1,
                            index: req.body.index1,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 0,
                            opiekun: 0,
                        }
                        encja2 = {
                            imie: req.body.imie2,
                            nazwisko: req.body.nazwisko2,
                            email: req.body.email2,
                            index: req.body.index2,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 0,
                            opiekun: 0,
                        }
                        encja3 = {
                            imie: req.body.imie3,
                            nazwisko: req.body.nazwisko3,
                            email: req.body.email3,
                            index: req.body.index3,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 0,
                            opiekun: 0,
                        }
                        encja4 = {
                            imie: req.body.imie4,
                            nazwisko: req.body.nazwisko4,
                            email: req.body.email4,
                            index: req.body.index4,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 0,
                            opiekun: 0,
                        }
                        encja5 = {
                            imie: req.body.imie5,
                            nazwisko: req.body.nazwisko5,
                            email: req.body.email5,
                            index: req.body.index5,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 0,
                            opiekun: 0,
                        }
                        encja6 = {
                            imie: req.body.imie6,
                            nazwisko: req.body.nazwisko6,
                            email: req.body.email6,
                            index: req.body.index6,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 1,
                            opiekun: 0,
                        }
                        encja7 = {
                            imie: req.body.imie7,
                            nazwisko: req.body.nazwisko7,
                            email: req.body.email7,
                            index: req.body.index7,
                            grupyId: groupid,
                            active: 1,
                            rezerwa: 1,
                            opiekun: 0,
                        }
                        encja8 = {
                            imie: req.body.imie8,
                            nazwisko: req.body.nazwisko8,
                            email: req.body.email8,
                            index: req.body.index8,
                            grupyId: groupid,
                            active: 0,
                            rezerwa: 0,
                            opiekun: 1,
                        }
                        itemArray.push(encja1);
                        itemArray.push(encja2);
                        itemArray.push(encja3);
                        itemArray.push(encja4);
                        itemArray.push(encja5);
                        itemArray.push(encja6);
                        itemArray.push(encja7);
                        itemArray.push(encja8);

                        return user.bulkCreate(itemArray, { transaction: t }).then(() => {

                            //itemArray = [];
                        }, err => {
                            console.log("ERROR: " + err)
                        })

                    })



                    return res.json({ message: "Pomyślne zapisanie drużyny :)" });
            });
        } catch {
            return res.json({ ErrorMessage: "Nieoczekiwany błąd spróbuj ponownie..." });
        }
    } else {
        return res.json({ ErrorMessage: "Niestety taka nazwa drużyny jest już zajęta..." });
    }
});

app.get('/data', (req, res) => {
    const data = { message: 'Hello, world!' };
    res.json(data);
  });
  
app.post('/submit-form2', (req, res) => {
    const name = req.body.name;

    // Check if the name is valid
    if (!name) {
        return res.status(400).json({ message: 'Please enter a valid name.' });
    }

    // If the name is valid, return a success message
    res.json({ message: name });
});


app.post('/szukaj', async(req, res) => {
    global.znajdz = req.body.szukaj
    res.redirect('/adminPage/search')
})

app.post('/szukaj2', async(req, res) => {
    global.znajdz2 = req.body.szukaj2
    res.redirect('/adminPage/searchadmin')
})





  app.get("/bracketGeneratorCS", async(req, res) => {

    await bracketTournamentCS.destroy({
        where: {},
        truncate: true
      })
      .then(async() => {
        console.log("Usunięto wszystkie rekordy z tabeli 'bracketTournamentCS'");
        const iloscDruzyn = await grupy.findAll({where: {
            active: 1,
            gra_CS: 1,
          },})
        
        for (let i = 0; i < iloscDruzyn.length; i = i + 2) { 
            let teamA_id = iloscDruzyn[i]?.id
            let teamB_id = iloscDruzyn[i+1]?.id
            await bracketTournamentCS.create({
                team_a_id: teamA_id,
                team_b_id: teamB_id,
                team_a_score:null,
                team_b_score:null,
                winner_id:null,
            })
        }
    
        for (let i = Math.ceil(iloscDruzyn.length / 2); i < iloscDruzyn.length-1; i++) { 
            await bracketTournamentCS.create({
                team_a_id: null,
                team_b_id: null,
                team_a_score:null,
                team_b_score:null,
                winner_id:null,
            })
        }

      })
      .catch((error) => {
        console.log("Błąd podczas usuwania rekordów z tabeli 'bracketTournamentCS': ", error);
      });

  });

  app.get("/bracketGeneratorLoL", async(req, res) => {

    await bracketTournamentLoL.destroy({
        where: {},
        truncate: true
      })
      .then(async() => {
        console.log("Usunięto wszystkie rekordy z tabeli 'bracketTournamentLoL'");
        const iloscDruzyn = await grupy.findAll({where: {
            active: 1,
            gra_LoL: 1,
          },})
        
        for (let i = 0; i < iloscDruzyn.length; i = i + 2) { 
            let teamA_id = iloscDruzyn[i]?.id
            let teamB_id = iloscDruzyn[i+1]?.id
            await bracketTournamentLoL.create({
                team_a_id: teamA_id,
                team_b_id: teamB_id,
                team_a_score:null,
                team_b_score:null,
                winner_id:null,
            })
        }
    
        for (let i = Math.ceil(iloscDruzyn.length / 2); i < iloscDruzyn.length-1; i++) { 
            await bracketTournamentLoL.create({
                team_a_id: null,
                team_b_id: null,
                team_a_score:null,
                team_b_score:null,
                winner_id:null,
            })
        }

      })
      .catch((error) => {
        console.log("Błąd podczas usuwania rekordów z tabeli 'bracketTournamentLoL': ", error);
      });

  });


  app.post("/updateMatch-B-:id", async(req, res) => {
    const id_match = req.params.id
    let id_team =  req.body.selectedValue;
    if(id_team == 0){
        id_team = null
    }
    console.log(id_match, id_team)
    await bracketTournament.update({
        team_b_id: id_team,
    }, {
        where: {
            id: id_match,
        },
    })

  });

  app.post("/updateMatch-A-:id", async(req, res) => {
    const id_match = req.params.id
    let id_team =  req.body.selectedValue;
    if(id_team == 0){
        id_team = null
    }
    console.log(id_match, id_team)
    await bracketTournament.update({
        team_a_id: id_team,
    }, {
        where: {
            id: id_match,
        },
    })

  });


