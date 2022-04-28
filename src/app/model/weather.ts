export class Weather {
    public temperature: number;
    public precipitation: number;
    public date: Date
    

    constructor(temperature, precipitation, date) {
        this.temperature = temperature;
        this.precipitation = precipitation;
        this.date = date;
      }
}