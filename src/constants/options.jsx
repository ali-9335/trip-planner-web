
export const SelectTravelersList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'As sole travels in explorations',
        icon: '✈️',  // Icon of airplane
        people: '1'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '💑',  // Icon of drink
        people: '2 People'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun-loving adventurers',
        icon: '👪',  // Icon of house
        people: '3 to 5 People'
    },
    {
        id: 4,
        title: 'Friend',
        desc: 'A group of fun-loving adventurers',
        icon: '👬',  // Icon of house
        people: '10 to 15 People'
    }
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💸',  // Icon of money
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Keep cost on average side',
        icon: '💴',  // Icon of money
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Don\'t worry about cost',
        icon: '💰',  // Icon of money
    }
];

export const AI_PROMPT = 'Generate Travel Plan for Location: {location},for {days} Days for {travelers} with a {budget} budget, give me Hotels options list with HotelName,Yptel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Placeimage Url, Geo Coordinates, ticket Pricing, Time to travel each of the location for {tdays} with each day plan with best time to visit in JSON format.';
