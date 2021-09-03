window.onload=function(){
  
    let btn=document.getElementById("filtrare");
    btn.onclick=function(){

        let inp=document.getElementById("inp-cuvinte-cheie");
        let filtru_cuv_cheie = inp.value;
        filtru_cuv_cheie=filtru_cuv_cheie.toUpperCase();

        //alert input invalid
        if(filtru_cuv_cheie.search(" ")!=-1)
            {alert("Introduceti un singur cuvant cheie!"); return;}


        let filtru_nume = document.getElementById("inp-nume").value;
        filtru_nume=filtru_nume.toUpperCase();

        //alert input invalid
        // if(filtru_nume=="")
        //    {alert("Introduceti numele produsului cautat!"); return;}

        
        inp=document.getElementById("inp-pret");
        let filtru_pret=parseInt(inp.value);

        let sel=document.getElementById("inp-categorie");
        let filtru_categorie=sel.value;

        var checkbox=document.getElementsByName("noutati");
        var filtru_noutati=0;

        for(let ch of checkbox)
             if(ch.checked)
                  filtru_noutati=1;
       
        //valorile din radiobuttons- promotie
        var radiobuttons=document.getElementsByName("promotie");		
		var sir="";
        var filtru_promotie=0;
		for(let rad of radiobuttons){
			if(rad.checked){
				sir=rad.value;
				break;
                //iesim din for ptc doar un radiobutton din grup poate fi bifat
			}
		}
        //0 -nu conteaza, 1-da, 2-nu 
        if(sir=="da") filtru_promotie=1;
        else if(sir=="nu") filtru_promotie=2;

        var optiuni=document.getElementById("sel_multiplu").options;		
		var lista=[]; //array 
		for(let opt of optiuni){
			if(opt.selected)
				lista.push(opt.value);
		}

        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="none";

            //[0] ptc getElementByClassName mereu returneaza un vector, aici cu un sg element

            // ---------------CONDITIE PRET 
            let pret= parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML)
            let conditie1= pret<=filtru_pret;

            //-----------nume
            let nume= prod.getElementsByClassName("val-nume")[0].innerHTML.trim(); //numele produsului curent 
            nume=nume.toUpperCase();
            let conditie2=0;
            if(nume=="")
                conditie2=1;
            else 
                conditie2=(nume.startsWith(filtru_nume)) ? 1:0; //incepe cu ce e dat in box 

            //----------------culoare-predom
            let categorieArt= prod.getElementsByClassName("val-culoare-predominanta")[0].innerHTML;
            let conditie3= (categorieArt==filtru_categorie || filtru_categorie=="oricare");
            
            
                 
            //-------------------cuvant cheie cautat in descriere
            let descriere= prod.getElementsByClassName("val-descriere")[0].innerHTML;
            descriere=descriere.toUpperCase().split(" "); //SPARG DESCRIEREA IN CUVINTE 
            let conditie4=0;
            for(cuv of descriere)
                 if(filtru_cuv_cheie==cuv)
                         {conditie4=1; break;}
                         

            // ---------------selectul multiplu -anotimp
            let date= prod.getElementsByClassName("val-recomandare")[0].innerHTML.trim().toLowerCase().split(',');
            let conditie5=1;

            console.log(lista);
            console.log(date);

            for(element of lista) //caut elementele selectate printre datele mele, 
            //anotimpurile selectate printre anotimpurile produsului meu 
               {   var ok=0;
                   for(elementdate of date)
                         if(element==elementdate)
                            {ok=1; break;}
                    if(ok==0) //nu am gasit unul
                    {
                        conditie5=0; break;
                    }        

               }

            let conditieFinala=conditie1 && conditie2 && conditie3 && conditie4 && conditie5;

            if (conditieFinala)
                 prod.style.display="grid";
        }
        
    }


    function sortArticole(factor){
        
        var produse=document.getElementsByClassName("produs");
        let arrayProduse=Array.from(produse);
        arrayProduse.sort(function(art1,art2){
            let nume1=art1.getElementsByClassName("val-nume")[0].innerHTML;
            let pret1=parseInt(art1.getElementsByClassName("val-pret")[0].innerHTML);
            let nume2=art2.getElementsByClassName("val-nume")[0].innerHTML;
            let pret2=parseInt(art2.getElementsByClassName("val-pret")[0].innerHTML);

            //factor decide daca e crescator sau descrescator la sortare
            //pozitiv=> swap
            //sortare cu 2 criterii

            if(nume1.localeCompare(nume2)==0) //nume egale, compar dupa pret
                return factor*(pret1 > pret2) ? 1 : -1;
            else //nume diferite, compar dupa nume
                return factor*nume1.localeCompare(nume2);
           
        });
        
        console.log(arrayProduse); 
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    btn=document.getElementById("sortCrescNume");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescrescNume");
    btn.onclick=function(){
        sortArticole(-1);
    }

    btn=document.getElementById("resetare");
    btn.onclick=function(){
        
        var produse=document.getElementsByClassName("produs");
        // le reafisez pe toate 
        for (let prod of produse){
            prod.style.display="grid";
        }
    }

    btn=document.getElementById("suma_preturi");

    //-----------------suma preturilor elementelor afisate 
    btn.onclick=function(){
        var produse=document.getElementsByClassName("produs");
        var suma=0;
        for (let prod of produse)
            if(prod.style.display!="none")
                suma+=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);

        console.log(suma);    
        var divul=document.createElement("div");
        divul.innerHTML = suma;
        divul.style.backgroundColor = "var(--culoare-mov-deschis)";
        
        document.getElementById("suma_preturi").appendChild(divul);
        setTimeout(function(){  divul.remove(); }, 2000);
       
        
    }

}