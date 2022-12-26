/**
 * A dictionary that maps the postal district to the postal sector.
 * Key: Postal District
 * Value: Postal Sector (1st 2 digits of 6-digit postal codes)
*/
const Dict_DistrictToSector = {
    '01': ['01', '02', '03', '04', '05', '06'],
    '02': ['07', '08'],
    '03': ['14', '15', '16'],
    '04': ['09', '10'],
    '05': ['11', '12', '13'],
    '06': ['17'],
    '07': ['18', '19'],
    '08': ['20', '21'],
    '09': ['22', '23'],
    '10': ['24', '25', '26', '27'],
    '11': ['28', '29', '30'],
    '12': ['31', '32', '33'],
    '13': ['34', '35', '36', '37'],
    '14': ['38', '39', '40,', '41'],
    '15': ['42', '43', '44', '45'],
    '16': ['46', '47', '48'],
    '17': ['49', '50', '81'],
    '18': ['51', '52'],
    '19': ['53', '54', '55', '82'],
    '20': ['56', '57'],
    '21': ['58', '59'],
    '22': ['60', '61', '62', '63', '64'],
    '23': ['65', '66', '67', '68'],
    '24': ['69', '70', '71'],
    '25': ['72', '73'],
    '26': ['77', '78'],
    '27': ['75', '76'],
    '28': ['79', '80'],
};

/**
 * A dictionary that maps the postal district to the postal sector.
 * Key: District
 * Value: Region Districts
*/
const Dict_DistrictToRegionDistricts = {
    '01': ['01', '02', '06', '07'],
    '02': ['01', '02', '06', '07'],
    '03': ['03', '04', '05', '08', '12', '13', '14', '15', '21', '22', '23', '24'],
    '04': ['03', '04', '08', '12', '13', '14', '15'],
    '05': ['03', '05', '21', '22', '23', '24'],
    '06': ['01', '02', '06', '07'],
    '07': ['01', '02', '06', '07'],
    '08': ['03', '04', '08', '12', '13', '14', '15'],
    '09': ['09,', '10', '11'],
    '10': ['09,', '10', '11'],
    '11': ['09,', '10', '11'],
    '12': ['03', '04', '08', '12', '13', '14', '15'],
    '13': ['03', '04', '08', '12', '13', '14', '15'],
    '14': ['03', '04', '08', '12', '13', '14', '15', '16', '17', '18'],
    '15': ['03', '04', '08', '12', '13', '14', '15', '16', '17', '18'],
    '16': ['14', '15', '16', '17', '18'],
    '17': ['14', '15', '16', '17', '18'],
    '18': ['14', '15', '16', '17', '18'],
    '19': ['19', '20', '28'],
    '20': ['19', '20', '28'],
    '21': ['03', '05', '21', '22', '23', '24'],
    '22': ['03', '05', '21', '22', '23', '24'],
    '23': ['03', '05', '21', '22', '23', '24'],
    '24': ['03', '05', '21', '22', '23', '24'],
    '25': ['25', '26', '27'],
    '26': ['25', '26', '27'],
    '27': ['25', '26', '27'],
    '28': ['19', '20', '28'],
};

/**
 * A dictionary that maps the region to the postal district.
 * Key: Region
 * Value: Postal District
*/
const Dict_RegionToDistrict = {
    'Downtown Core': ['01', '02', '06', '07'],
    'Prime District': ['09,', '10', '11'],
    'City Fringe': ['03', '04', '08', '12', '13', '14', '15'],
    'East Region': ['14', '15', '16', '17', '18'],
    'West Region': ['03', '05', '21', '22', '23', '24'],
    'Northeast Region': ['19', '20', '28'],
    'North Region': ['25', '26', '27']
};

exports.filterByDistrict = (postal) => {
    if (postal.length !== 6) {
        return null;
    }

    let identifier = postal.slice(0, 2);
    for (const [k, v] of Object.entries(Dict_DistrictToSector)) {
        if (v.find(el => el === identifier))
            return v;
    }

    return null;
};

exports.filterByRegion = (postal) => {
    if (postal.length !== 6) {
        return null;
    }

    let identifier = postal.slice(0, 2);
    let district;
    for (const [k, v] of Object.entries(Dict_DistrictToSector)) {
        if (v.find(el => el === identifier)) {
            district = k;
            break;
        }
    }

    let region;
    for (const [k, v] of Object.entries(Dict_DistrictToRegionDistricts)) {
        if (v.find(el => el === district)) {
            region = v;
        }
    }

    let sectors = [];
    if (region) {
        for (let i = 0; i < region.length; i++) {
            sectors.push(...Dict_DistrictToSector[region[i]]);
        }
        return sectors;
    }

    return null;
};