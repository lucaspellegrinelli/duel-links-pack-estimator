const SIM_INITIAL_ITERATIONS = 1234;
const SIM_ITERATIONS = 12345;

let loading_colors = ["16a085", "#0D6E5B"];
let current_loading_color = 0;

let button_enabled = true;

$(function(){
  $("#box-list").html("");

  let row = create_new_row();
  create_box_dom(last_box_id++).appendTo(row.find("div:nth-child(1)"));
  create_new_box_dom().appendTo(row.find("div:nth-child(2)"));

  set_box_values(1, {
    boxtype: "MAIN BOX",
    cards: [
      { type: "UR", amount: 3 },
      { type: "UR", amount: 1 },
      { type: "SR", amount: 3 },
      { type: "SR", amount: 2 },
    ]
  });

  initiate_simulation(true);

  $("#simulate-button").click(function(){
    initiate_simulation(false);
  });
});

function initiate_simulation(initial=false){
  if(!button_enabled) return;

  button_enabled = false;
  let boxes_cards = [];

  if(!initial && simulator_worker != undefined) percentage_ui_color();

  $("#box-list > div > div > #card-box").each(function(){
    let this_box_type = $(this).find("select.box-type-selector > option:selected").val();
    let this_box_cards = [];
    $(this).find("ul").children().each(function(){
      let rarity = $(this).find("select.rarity-select > option:selected").val();
      let amount = $(this).find("select.amount-select > option:selected").val();

      this_box_cards.push({
        "type": rarity == "UR" ? UR : SR,
        "amount": parseInt(amount)
      });
    });

    let boxtype = -1;
    if(this_box_type == "MINI BOX"){
      boxtype = MINI_BOX;
    }else if(this_box_type == "MAIN BOX"){
      boxtype = MAIN_BOX;
    }else if(this_box_type == "SELECTION"){
      boxtype = SELECTION;
    }

    boxes_cards.push({
      "boxtype": boxtype,
      "cards": this_box_cards
    });
  });

  let iterations = initial ? SIM_INITIAL_ITERATIONS : SIM_ITERATIONS;
  let real_iter = iterations / boxes_cards.length;

  if(simulator_worker != undefined){
    simulator_worker.postMessage([boxes_cards, real_iter]);
    simulator_worker.onmessage = function(e){
      if(e.data.done){
        update_simulation_ui(e.data.result, e.data.exectime, real_iter);
        button_enabled = true;
      }else if(!initial){
        percentage_ui_update(e.data.progress);
      }
    }
  }else{
    let simulator = new Simulator(boxes_cards, real_iter);
    let result = simulator.run(percentage_ui_update);
    update_simulation_ui(result.result, result.exectime, real_iter);
    button_enabled = true;
  }
}

function percentage_ui_color(){
  $("#simulate-button > .simulate-progress").css("width", 0);
  $("#simulate-button").css("background-color", loading_colors[current_loading_color]);
  current_loading_color = current_loading_color == 0 ? 1 : 0;
  $("#simulate-button > .simulate-progress").css("background-color", loading_colors[current_loading_color]);
}

function percentage_ui_update(perc){
  $("#simulate-button > .simulate-progress").css("width", (perc * 100).toFixed(1) + "%");
}
