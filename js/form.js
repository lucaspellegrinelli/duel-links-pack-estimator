let last_box_id = 0;
const boxes_per_row = 4;

function update_simulation_ui(simulated, elapsed_time, real_iter){
  let graphmaker = new GraphMaker("cumulative", simulated, real_iter, 50);
  let graph = graphmaker.build_graph();
  let simulated_gems = [];
  simulated.forEach(function(item){ simulated_gems.push(item * 50); });

  $("#mean-packs").html(simulated.mean().toFixed(2));
  $("#std-packs").html(simulated.std().toFixed(2));
  $("#total-packs").html(simulated.sum().toFixed(0));
  $("#mean-gems").html(simulated_gems.mean().toFixed(2));
  $("#std-gems").html(simulated_gems.std().toFixed(2));
  $("#time-taken").html(elapsed_time.toFixed(2) + "s");
}

function create_box_dom(id){
  let pack_config = $("<div>", {"class": "pack-config", "id": "card-box"});
  let pack_header = $("<div>", {"class": "pack-header"});
  let pack_title = $("<div>", {"class": "pack-title"}).html("BOX " + (id + 1));
  let box_type = $("<select>", {"class": "box-type-selector"});
  let delete_button = $("<i>", {"class": "material-icons remove-box-button hover-red"}).html("delete");
  let list = $("<ul>", {"class": "list-group"});
  let pack_footer = $("<div>", {"class": "pack-footer"});
  let pack_footer_buttons = $("<div>", {"class": "pack-footer-buttons"});
  let add_button = $("<i>", {"class": "material-icons pack-footer-icon hover-green"}).html("add");
  let remove_button = $("<i>", {"class": "material-icons pack-footer-icon hover-red"}).html("remove");

  create_list_item().appendTo(list);

  $('<option selected="selected">MAIN BOX</option>').appendTo(box_type);
  $("<option>MINI BOX</option>").appendTo(box_type);
  $("<option>SELECTION</option>").appendTo(box_type);

  add_button.click(function(){
    create_list_item().appendTo(list);
  });

  remove_button.click(function(){
    if(list.children().length > 1){
      list.children().last().remove();
    }
  });

  delete_button.click(function(){
    if(last_box_id > 1){
      let parent = pack_config.parent();
      pack_config.remove();

      parent.nextAll().each(function(){
        if($(this).find(".pack-title").length > 0){
          let last_id = parseInt($(this).find(".pack-title").html().split(" ")[1]);
          $(this).find(".pack-title").html("BOX " + (last_id - 1));
        }

        $(this).children().first().appendTo($(this).prev());
      });

      if($("#add-box").length == 0){
        create_new_box_dom().appendTo(parent.parent().children().last());
      }

      last_box_id--;
    }
  });

  add_button.appendTo(pack_footer_buttons);
  remove_button.appendTo(pack_footer_buttons);
  pack_footer_buttons.appendTo(pack_footer);
  pack_title.appendTo(pack_header);
  box_type.appendTo(pack_header);
  delete_button.appendTo(pack_header);
  pack_header.appendTo(pack_config);
  list.appendTo(pack_config);
  pack_footer.appendTo(pack_config);

  return pack_config;
}

function create_new_box_dom(){
  let pack_config = $("<div>", {"class": "pack-config", "id": "add-box"});
  let add_pack = $("<div>", {"class": "add-pack"});
  let add_button = $("<i>", {"class": "material-icons add-pack-button"}).html("add");
  let add_text = $("<div>", {"class": "add-pack-text"}).html("ADD NEW BOX");

  add_pack.click(function(){
    let parent = pack_config.parent();
    create_box_dom(last_box_id++).appendTo(parent);

    if(last_box_id < boxes_per_row){
      pack_config.appendTo(parent.next());
    }

    if(last_box_id == boxes_per_row){
      pack_config.remove();
    }
  });

  add_button.appendTo(add_pack);
  add_text.appendTo(add_pack);
  add_pack.appendTo(pack_config);

  return pack_config;
}

function create_new_row(){
  let row = $("<div>", {"class": "row pack-row"});
  for(let i = 0; i < boxes_per_row; i++){
    $("<div>", {"class": "col-lg-3"}).appendTo(row);
  }

  row.appendTo($("#box-list"));
  return row;
}

function create_list_item(rar="UR", amt=3){
  let list_item = $("<li>", {"class": "list-group-item"});
  let rarity = $("<select>", {"class": "rarity-select"});
  let amount = $("<select>", {"class": "amount-select"});

  ["UR", "SR"].forEach(function(item){
    $('<option>', {"selected": item == rar, "html": item}).appendTo(rarity);
  });

  [1, 2, 3].forEach(function(item){
    $('<option>', {"selected": item == amt, "html": item}).appendTo(amount);
  });

  rarity.appendTo(list_item);
  amount.appendTo(list_item);

  return list_item;
}

function set_box_values(id, values){
  let target = $("#box-list > div > div > #card-box:nth-of-type(" + id + ")");
  target.find("select.box-type-selector").children("option").each(function(){
    if($(this).val() == values.boxtype){
      $(this).attr('selected', 'selected');
    }else{
      $(this).removeAttr('selected');
    }
  });

  let ul_target = target.find("ul.list-group");
  ul_target.html("");
  values.cards.forEach(function(item){
    create_list_item(item.type, item.amount).appendTo(ul_target);
  });
}
