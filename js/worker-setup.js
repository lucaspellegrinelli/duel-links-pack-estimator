let simulator_worker = undefined;
if(window.Worker){
  try{
    simulator_worker = new Worker("./js/simulator-worker.js");
    console.log("Using Workers");
  }catch(e){
    console.log("Not using Workers");
  }
}else{
  console.log("Not using Workers");
}
