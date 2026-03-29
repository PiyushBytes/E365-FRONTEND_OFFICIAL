const max = prompt("enter a max no:");

const random = Math.floor(Math.random()*max)+1;

const guss = prompt("guss the number :");

while(true){
  if(guss == "quit"){
    console.log("user quit");
    break;
  }

  if(guss == random){
    console.log("congratulation your guss is write !");
    break;
  }

   
  else if(guss < random){
     guss = prompt("gussing no is to small : try again!");
  }
  
  else{
      guss = prompt("gussing no is to big , please try again");
  }
}