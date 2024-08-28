import React, { Component, } from "react";
// import { isRecord } from './record';
import { Guest } from './Guest';
import { AddGuest } from "./AddGuest";
import { GuestList } from "./GuestList";
import { GuestDetails } from "./GuestDetails";

// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type Page = "list" | "add" | {kind: "guest", name: string};

type WeddingAppState = {
  page: Page,
  guests: Array<Guest>

};

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: "list", guests: []};
  }
  
  render = (): JSX.Element => {
    if (this.state.page === "list") {
      return <GuestList 
                        onAddGuestClick={this.doAddGuestClick}
                        onGuestClick={this.doGuestClick}></GuestList>
    } else if (this.state.page === "add") {
      return <AddGuest 
                        doBackClick={this.doBackClick}></AddGuest>
    } else {
      return <GuestDetails 
                            name={this.state.page.name}
                            // onSaveClick={this.doSaveClick}
                            onBackClick={this.doBackClick}></GuestDetails>
    }
  };



  // doStartClick = (info: NewGuest): void => {
  //   const person_info: Guest = {name: info.name, guest_of: info.guest_of, family: info.family, plus_one: false, tag_alongs: 0, 
  //                               diet_restriction: undefined, guest_name: undefined, guest_restrictions: undefined};
  //   const updated = this.state.guests.concat([person_info]);
  //   this.setState({page: "list",guests: updated});
  // };


  doAddGuestClick = (): void => {
    this.setState({page: "add"});
  };

  doBackClick = (): void => {
    this.setState({page: "list"});
  }

  doGuestClick = (name: string): void => {
    this.setState({page: {kind: "guest", name: name}});
  }

  doSaveClick = (index: number, diet_restriction: string, additional_guests: number, plus_one: boolean): void => {
    const old: Guest = this.state.guests[index];
    const updated_guest: Guest = {name: old.name, guest_of: old.guest_of, family: old.family, plus_one: plus_one, tag_alongs: additional_guests, diet_restriction: diet_restriction, guest_name: "", guest_restrictions: ""};
    const updated = this.state.guests.slice(0, index).concat(updated_guest).concat(this.state.guests.slice((index+1)));
    this.setState({guests: updated, page: "list"});
  }

}






// type WeddingAppState = {
//   name: string;  // mirror state of name text box
//   msg: string;   // message sent from server
// }


// /** Displays the UI of the Wedding rsvp application. */
// export class WeddingApp extends Component<{}, WeddingAppState> {

//   constructor(props: {}) {
//     super(props);

//     this.state = {name: "", msg: ""};
//   }
  
//   render = (): JSX.Element => {
//     return (<div>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input type="name" id="name" value={this.state.name}
//                  onChange={this.doNameChange}></input>
//           <button onClick={this.doDummyClick}>Dummy</button>
//         </div>
//         {this.renderMessage()}
//       </div>);
//   };

//   renderMessage = (): JSX.Element => {
//     if (this.state.msg === "") {
//       return <div></div>;
//     } else {
//       return <p>Server says: {this.state.msg}</p>;
//     }
//   };

//   doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
//     this.setState({name: evt.target.value, msg: ""});
//   };

//   doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
//     const name = this.state.name.trim();
//     if (name.length > 0) {
//       const url = "/api/dummy?name=" + encodeURIComponent(name);
//       fetch(url).then(this.doDummyResp)
//           .catch(() => this.doDummyError("failed to connect to server"));
//     }
//   };

//   doDummyResp = (res: Response): void => {
//     if (res.status === 200) {
//       res.json().then(this.doDummyJson)
//           .catch(() => this.doDummyError("200 response is not JSON"));
//     } else if (res.status === 400) {
//       res.text().then(this.doDummyError)
//           .catch(() => this.doDummyError("400 response is not name"));
//     } else {
//       this.doDummyError(`bad status code ${res.status}`);
//     }
//   };

//   doDummyJson = (data: unknown): void => {
//     if (!isRecord(data)) {
//       console.error("200 response is not a record", data);
//       return;
//     }

//     if (typeof data.msg !== "string") {
//       console.error("'msg' field of 200 response is not a string", data.msg);
//       return;
//     }

//     this.setState({msg: data.msg});
//   }

//   doDummyError = (msg: string): void => {
//     console.error(`Error fetching /api/dummy: ${msg}`);
//   };

// }