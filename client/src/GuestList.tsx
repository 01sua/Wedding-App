import React, { Component, MouseEvent } from 'react';
import { Guest, parseGuest } from './Guest';
import { isRecord } from './record';

type GuestListProps = {
    // info: Array<Guest>,
    onAddGuestClick: () => void,
    onGuestClick: (name: string) => void
}

type GuestListState = {
    guests: Guest[] | undefined
}

// Shows a list of all of the guests and a summary
export class GuestList extends Component<GuestListProps, GuestListState> {

    constructor(props: GuestListProps) {
        super(props);
        this.state = {guests: undefined};
    }

    componentDidMount = (): void => {
        this.doRefreshClick();
    }

    render = (): JSX.Element => {
        return (
            <div>
                <h1>Guest List</h1>
                {/* <ul>{this.renderGuests()}</ul> */}
                {this.renderGuests()}
                <br></br>
                <h2>Summary:</h2>
                {/* <ul>{this.renderSummary()}</ul> */}
                {this.renderSummary()}
                <button onClick={this.doAddGuestClick}>Add Guest</button>
            </div>
        );
    };

    renderGuests = (): JSX.Element => {
        if (this.state.guests === undefined) {
            return <p>Loading guests list...</p>;
        }
        const guests: JSX.Element[] = [];
        // Inv: auctions = LI for each of auctions[0 .. i-1]
        for (let i = 0; i < this.state.guests.length; i++) {
            const guest = this.state.guests[i];
            guests.push(
              <li key={guest.name}>
                <div>
                    <a href="#" onClick={(evt) => this.doGuestClick(evt, guest.name)}>{guest.name}  </a>
                      Guest of {guest.guest_of} {(guest.plus_one) ?  "+" + guest.tag_alongs : "+1?"}
                </div>
              </li>);
          }
        return <ul>{guests}</ul>;
    }

    // Don't have any clickables so don't need to call a props do
    renderSummary = (): JSX.Element => {
        if (this.state.guests === undefined) {
            return <p>Loading guests list...</p>;
        }
        const summary: JSX.Element[] =[]
        const Molly_min = CountMin(this.state.guests, 0, "Molly");
        const Molly_max = CountMax(this.state.guests, 0, "Molly");
        const Molly_family = CountFamily(this.state.guests, 0, "Molly");
        const James_min = CountMin(this.state.guests, 0, "James");
        const James_max = CountMax(this.state.guests, 0, "James");
        const James_family = CountFamily(this.state.guests, 0, "James");

        if (Molly_min === Molly_max) {
            summary.push(
                <li>{Molly_min} guest(s) of Molly  ({Molly_family} family)</li>
            )
        } else {
            summary.push(
                <li>{Molly_min}-{Molly_max} guest(s) of Molly ({Molly_family} family)</li>
            )    
        }
        if (James_min === James_max) {
            summary.push(
                <li>{James_min} guest(s) of James ({James_family} family) </li>
            )
        } else {
            summary.push(
                <li>{James_min}-{James_max} guest(s) of James ({James_family} family) </li>
            )
        }
        return <ul>{summary}</ul>;
    }


    doAddGuestClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onAddGuestClick();
    }

    doGuestClick = (_evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
        this.props.onGuestClick(name);
    } 

    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doListJson)
              .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doListError)
              .catch(() => this.doListError("400 response is not text"));
        } else {
          this.doListError(`bad status code from /api/list: ${resp.status}`);
        }   
    };

    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/list: not a record", data);
            return;
        }

        if (!Array.isArray(data.guests)) {
            console.error("bad data from /api/list: guests is no an array");
            return;
        }

        const guests: Guest[] = [];
        for (const val of data.guests) {
            const guest = parseGuest(val);
            if (guest === undefined)
                return;
            guests.push(guest);
        }
        this.setState({guests});
    };

    doListError = (msg: string): void => {
        console.error(`Error fetching /api/list: ${msg}`);
    };

    doRefreshClick = (): void => {
        fetch("/api/list").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    }
}


/**
 * 
 * @param info Guest list array to count number of guests from
 * @param index which guest were on
 * @param guest_of checking if we're looking for molly or james guests
 * @returns minimum number of guests of either james or molly
 */
export const CountMin = (info: Array<Guest>, index: number, guest_of: string): number => {
    if (info.length <= index) {
        return 0;
    } else {
        if (info[index].guest_of !== guest_of) {
            return CountMin(info, (index + 1), guest_of);
        }
        if (info[index].plus_one) {
            return 1 + info[index].tag_alongs + CountMin(info, (index + 1), guest_of);
        } else {
            return 1 + CountMin(info, (index + 1), guest_of);
        }
    }
}

/**
 * 
 * @param info Guest list array to count number of guests from
 * @param index which guest were on
 * @param guest_of checking if we're looking for molly or james guests
 * @returns maximum number of guets of either james or molly
 */
export const CountMax = (info: Array<Guest>, index: number, guest_of: string): number => {
    if (info.length <= index) {
        return 0;
    } else {
        if (info[index].guest_of !== guest_of) {
            return CountMax(info, (index + 1), guest_of);
        }
        if (info[index].plus_one) {
            return 1 + info[index].tag_alongs + CountMax(info, (index + 1), guest_of);
        } else {
            return 2 + CountMax(info, (index + 1), guest_of);
        }
    }
}

/**
 * 
 * @param info guest list array to count number of guests that are family members
 * @param index which guest were on
 * @param guest_of checking if we're looking for molly or james family members
 * @returns number of family members of either james or molly
 */
export const CountFamily = (info: Array<Guest>, index: number, guest_of: string): number => {
    if (info.length <= index) {
        return 0;
    } else {
        if (info[index].guest_of !== guest_of) {
            return CountFamily(info, (index + 1), guest_of);
        }
        if (info[index].family) {
            return 1 + CountFamily(info, (index + 1), guest_of);
        } else {
            return CountFamily(info, (index + 1), guest_of);
        }
    }
}