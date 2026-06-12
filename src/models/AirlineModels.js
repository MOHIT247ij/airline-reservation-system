export class Flight {
  constructor(number, source, destination, date, time) {
    this.number = number;
    this.source = source;
    this.destination = destination;
    this.date = date;
    this.time = time;
  }
}

export class Passenger {
  constructor(name, age, ticketNo, flight) {
    this.name = name;
    this.age = Number(age);
    this.ticketNo = ticketNo;
    this.flight = flight; // object of Flight class
  }
}

export class AirlineStaff {
  constructor(name, staffId, counterNo, shift) {
    this.name = name;
    this.staffId = staffId;
    this.counterNo = counterNo;
    this.shift = shift; // Morning / Night etc.
    this.passengers = [];
    this.createdAt = new Date().toISOString();
  }

  addPassenger(name, age, ticketNo, flightNumber, source, destination, date, time) {
    const flight = new Flight(flightNumber, source, destination, date, time);
    const passenger = new Passenger(name, age, ticketNo, flight);
    this.passengers.push(passenger);
  }

  toJSON() {
    return {
      name: this.name,
      staffId: this.staffId,
      counterNo: this.counterNo,
      shift: this.shift,
      passengers: this.passengers.map(p => ({
        name: p.name,
        age: p.age,
        ticketNo: p.ticketNo,
        flight: p.flight
      })),
      createdAt: this.createdAt
    };
  }
}
