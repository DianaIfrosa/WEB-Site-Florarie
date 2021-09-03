const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {Client} =require('pg');
const url = require('url');
const { exec } = require("child_process");
const ejs=require('ejs');

const session = require('express-session');
const formidable = require('formidable');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const xmljs = require('xml-js');
const request = require('request');


var app=express(); 

app.use(["/produse_cos","/cumpara"],express.json({limit:'2mb'}));//obligatoriu de setat pt request body de tip json
//trec mai jos paginile cu cereri post pe care vreau sa le tratez cu req.body si nu cu formidable
app.use(["/contact"], express.urlencoded({extended:true}));

//setez o sesiune
app.use(session({
  secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
  resave: true,
  saveUninitialized: false
}));


const client = new Client({
    host: 'localhost',
    user: 'diana',
    password: 'diana',
    database: 'site_db',
    port:5432
})

client.connect()


app.set("view engine","ejs"); // motor de template ejs

app.get("*/galerie.json", function(req,res){

    res.status(403).render("pagini/403");

});


app.use("/resurse",express.static(__dirname+"/resurse"));//setez folderul de resurse ca static
function parolarandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
function verificaImagini(){

	var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
	var jsi=JSON.parse(textFisier); //am transformat in obiect

	var caleGalerie=jsi.cale_galerie;

    //creez localStorage
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
      }

    let vecnr=[5,6,7];
    let random =vecnr[Math.floor(Math.random()*vecnr.length)];//iau un nr random de imagini
    localStorage.nrrandom= random;

    let vectImagini=[];

	for (let im of jsi.imagini){
		let imVeche= path.join(caleGalerie, im.cale_fisier);//obtin calea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
        
        var ext = path.extname(im.cale_fisier);//extensia
		var numeFisier =path.basename(im.cale_fisier,ext);//numele fara extensie
		let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".jpg");//creez calea pentru imaginea noua; prin extensia wbp stabilesc si tipul ei
        
        let imNoua2=path.join(caleGalerie+"/mediu/", numeFisier+"-mediu"+".jpg"); //pentru imaginile de ecran mediu

        var d = new Date();
        var n = d.getMonth()+1; 


        if(vectImagini.length>13) //maxim 13 imagini
            break;
        else
         if((n==12 || n==1 || n==2) && im.anotimp.includes("iarna"))
                vectImagini.push({mare:imVeche, mic:imNoua, mediu:imNoua2, descriere:im.text_descriere, titlu:im.titlu}); //adauga in vector un element
        else if((n==3 || n==4 || n==5) && im.anotimp.includes("primavara"))
                vectImagini.push({mare:imVeche, mic:imNoua,  mediu:imNoua2, descriere:im.text_descriere, titlu:im.titlu}); //adauga in vector un element
        else if((n==6 || n==7 || n==8) && im.anotimp.includes("vara"))
                vectImagini.push({mare:imVeche, mic:imNoua,  mediu:imNoua2, descriere:im.text_descriere, titlu:im.titlu}); //adauga in vector un element
        else if((n==9 || n==10 || n==11) && im.anotimp.includes("toamna"))
                vectImagini.push({mare:imVeche, mic:imNoua,  mediu:imNoua2, descriere:im.text_descriere, titlu:im.titlu}); //adauga in vector un element
        

        if (!fs.existsSync(imNoua))//daca nu exista imaginea mica, o creez
        
		sharp(imVeche)
		  .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imNoua, function(err) {
              console.log(imVeche, " ", imNoua);
              if(err)
			    console.log("eroare conversie",imVeche, "->", imNoua, err);
                
		  });
          if (!fs.existsSync(imNoua2))//daca nu exista imaginea medie, o creez
        
          sharp(imVeche)
            .resize(300) 
            .toFile(imNoua2, function(err) {
                console.log(imVeche, " ", imNoua2);
                if(err)
                  console.log("eroare conversie",imVeche, "->", imNoua2, err);
                  
            });

        
          
	}

    return vectImagini;
}


async function trimiteMail(username, nume, prenume, email){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"testtehniciweb@gmail.com",
			pass:"testtehniciweb123"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"testtehniciweb@gmail.com",
		to:email,
		subject:"Salut, "+prenume+" "+ nume+"!",
		html:"<p>Te-ai inregistrat pe site-ul nostru <b>Floraria Rosa </b> cu username-ul <div style='font-style:italic'>"+username+" </div></p>"
	
    })
	console.log("trimis mail");
}

async function trimiteMailParola(email,username, parolanoua, prenume, nume)
{
    var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"testtehniciweb@gmail.com",
			pass:"testtehniciweb123"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"testtehniciweb@gmail.com",
		to:email,
		subject:"Salut, "+prenume+" "+ nume+"!",
		html:"<p>Parola ta de pe site-ul nostru <b>Floraria Rosa </b> a fost modificata! Username-ul a ramas <div style='font-style:italic'>"+username+" </div> iar parola este acum "+parolanoua+".</p>"
	
    })
	console.log("trimis mail");

}


app.get(["/","/index"],function(req, res){//ca sa pot accesa pagina principala si cu localhost:8081 si cu localhost:8081/index
   

    res.render("pagini/index", {imagini: verificaImagini(), ip:req.ip, utilizator: req.session.utilizator}); /* relative intotdeauna la folderul views*/

});


/*----------------galerie animata---------------*/

app.get("*/galerie-animata.css",function(req, res){
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata.scss").toString("utf-8");//citesc scss-ul ca string
    
  
    let rezScss=ejs.render(sirScss,{nrIm:localStorage.getItem("nrrandom")});// transmit numarul catre scss si obtin sirul cu scss-ul compilat
    
    console.log(rezScss);


    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar

    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }

        //console.log(`stdout: ${stdout}`);
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });

});



app.get("/produse",function(req, res){
    
    let conditie= req.query.tip ?  " and tip='"+req.query.tip+"'" : "";
    
    client.query("select tip,id,descriere, imagine, nume, pret, culoare, recomandare, data_adaugare, la_promotie, flori_predominante from flori where 1=1"+conditie, function(err,rez){
    
            let minim=100000;
            let maxim=-1;
            for(let prod of rez.rows)
            {
                if(parseInt(prod.pret)<minim) minim=parseInt(prod.pret);
                if(parseInt(prod.pret)>maxim) maxim=parseInt(prod.pret);
            }

//aici enum_range  imi ia toate elementele din enumul dat ptc are null::
//unnest=> vector de obiecte
        client.query("select unnest(enum_range( null::culori)) as categ", function(err,rezCateg){
            
            res.render("pagini/produse", {produse:rez.rows, categorii:rezCateg.rows, pretminim:minim, pretmaxim:maxim, utilizator: req.session.utilizator });
           
            });
          
    });
    
});


app.get("/galerie-pag", function(req,res){

    res.render("pagini/galerie-pag", {imagini: verificaImagini(), ip:req.ip, utilizator: req.session.utilizator}); /* relative intotdeauna la folderul views*/

});

//pagina produsului 
app.get("/produs/:id_floare",function(req, res){
    
    const rezultat= client.query("select * from flori where id="+req.params.id_floare, function(err,rez){
        res.render("pagini/produs", {prod:rez.rows[0] , utilizator: req.session.utilizator});
    });

    
});
app.post("/login", function(req,res){
    let formular= formidable.IncomingForm();
    formular.parse(req, function(err, campuriText){
        //console.log(campuriText);
        let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
       
        let comanda_param= `select id,username,nume,prenume, email, rol, imagine  from utilizatori where username= $1::text and parola=$2::text`;
        
        
        client.query(comanda_param, [campuriText.username, parolaCriptata], function(err, rez){
        
            if (!err){
                //console.log(rez);
                if (rez.rows.length == 1){

                    req.session.utilizator={
                        //obiect
                        id:rez.rows[0].id,
                        username:rez.rows[0].username,
                        nume:rez.rows[0].nume,
                        prenume:rez.rows[0].prenume,
                        email:rez.rows[0].email,
						rol:rez.rows[0].rol,
                        imagine: rez.rows[0].imagine
                    }
                   

                }
                
            }
            
            res.redirect("/index");
        });
    }); 
})

 
//campuriText are ca proprietati numele inputurilor din inregistrare.ejs
let parolaServer="tehniciweb";
app.post("/inregistrare",function(req, res){ 
    console.log("primit date");
    var username;

    
    var cale_poza="/resurse/imagini/default.png";

    let formular= formidable.IncomingForm();
	//nr ordine: 4
    formular.parse(req, function(err, campuriText, campuriFisier){
        //console.log(campuriText);
		eroare ="";
        //------------------VERIFICARE CAMPURI -REQUIRED- 
        if(campuriText.nume=="")
        {
            eroare+="Trebuie introdus un nume! ";
        }
        //LA PRENUME VERIFIC SI SA NU AIBA CIFRE SAU ALTE CARACTERE 
        if(campuriText.prenume=="" || !campuriText.prenume.match("^[A-Za-z]+$"))
        {
            eroare+="Trebuie introdus un prenume valid! ";
        }
		if(campuriText.username=="")
        {
			eroare+="Username invalid! ";
		}
        if(campuriText.parola=="")
        {
            eroare+="Trebuie introdusă o parola! ";
        }
        if(campuriText.rparola=="")
        {
            eroare+="Trebuie reintrodusă parola de mai sus! ";
        }
        if(campuriText.email=="" )
        {
            eroare+="Adresă de e-mail invalidă! ";
        }
        

    
		if(!eroare){
            //--------------------------criptez parola
			let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');
			let comanda= `insert into utilizatori (username, nume, prenume, email, parola, imagine) values ($1::text, $2::text, $3::text, $4::text, $5::text,  $6::text)`;
			let comanda_verif= `select id,username,nume, email, rol from utilizatori where username= $1::text and parola=$2::text`;
            
            //console.log(comanda);

            //-------------verific daca nu mai exista un cont 
            client.query(comanda_verif, [campuriText.username, parolaCriptata], function(err, rez) {
                    
                    if(!err)
                    {
                            if(rez.rows.length!=0) //s-a mai gasit un cont
                                {
                                res.render("pagini/inregistrare",{err:"Eroare bază de date", raspuns:"Cont deja existent", utilizator: req.session.utilizator});
                                }

                            else
                            {
                               
                                client.query(comanda,  [campuriText.username, campuriText.nume, campuriText.prenume, campuriText.email, parolaCriptata, cale_poza] ,function(err, rez){
                                    if (err){
                                        console.log(err);
                                        res.render("pagini/inregistrare",{err:"Eroare bază de date", raspuns:"Datele nu au fost introduse.", utilizator: req.session.utilizator});
                                    }
                                    else{
                                        res.render("pagini/inregistrare",{err:"", raspuns:"Nu au avut loc erori!", utilizator: req.session.utilizator});
                                        
                                        trimiteMail(campuriText.username, campuriText.nume, campuriText.prenume, campuriText.email);
                                       
                                        console.log(campuriText.email);
                                    }
                                });

                            }
                            
                            

                    }
                    else console.log(err);



            });
			
		}
		else{
					res.render("pagini/inregistrare",{err:"Eroare formular. "+eroare, raspuns:"", utilizator: req.session.utilizator});
		}
        
    });
	
	//nr ordine: 2
	formular.on("fileBegin", function(name,campFisier){
		console.log("inceput upload: ", campFisier);
		if(campFisier && campFisier.name!=""){
			//am  fisier transmis, salvez la o cale pusa de mine 
			var cale=__dirname+"/resurse/imagini/poze_uploadate/"+username
			if (!fs.existsSync(cale))
				fs.mkdirSync(cale);
			campFisier.path=cale+"/"+campFisier.name;
 
            cale_poza="/resurse/imagini/poze_uploadate/"+username+"/"+campFisier.name;
			console.log(campFisier.path);
		}
	});	
	
	
	//nr ordine: 1
	formular.on("field", function(name,field){
		if(name=='username')
			username=field;
		console.log("camp - field:", name)
	});
	
	//nr ordine: 3
	formular.on("file", function(name,field){
		console.log("final upload: ", name);
	});
	
	
	
	
});
//-------------------------------- actiunile admin-ului: afisare si resetare parola utilizator --------------------------------------

app.get('/useri', function(req, res){
	
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        client.query("select * from utilizatori",function(err, rezultat){
            if(err) throw err;
           // console.log(rezultat);
            res.render('pagini/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
        });
	} else{
		res.status(403).render('pagini/eroare',{mesaj:"Nu aveti acces!", utilizator:req.session.utilizator});
	}

});

app.post("/modif-parola",function(req, res){
	if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
	var formular= formidable.IncomingForm()
	
	formular.parse(req, function(err, campuriText, campuriFisier){
        var parolanoua=parolarandom(7);
		var comanda=`update utilizatori set parola='${parolanoua}' where id='${campuriText.id_utiliz}'`;
        
		client.query(comanda, function(err, rez){
            if(!err)
                trimiteMailParola(campuriText.email, campuriText.username, parolanoua, campuriText.prenume, campuriText.nume);
            res.render("pagini/index",{ utilizator: req.session.utilizator});
                                        
		});
	});
	}
	res.redirect("/useri");
	
});

//------------------------------LOGOUT----------------------------------

app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/index");
});

app.get("/*",function(req, res){    

    res.render("pagini"+req.url,  {utilizator: req.session.utilizator}, function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                res.status(404).render("pagini/404",{utilizator: req.session.utilizator});
            }
            else 
                throw err;
        }
        else{
            res.send(rezultatRandare);   
        }
    });
});


verificaImagini();

app.listen(8081);

console.log("A pornit serverul.");
