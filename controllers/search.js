standard = (user) => {
    let condition = {
        firstConnection: false,
        ..
    };

    firstConnection: false,
        orientation: { $in: [both.gender, "both"] },
    login: { $ne: req.session.login },
    location: {
        $nearSphere: {
            $geometry: {
                type: "Point",
                    coordinates: [parseFloat(both.tmpLng), parseFloat(both.tmpLat)]
            },
            $minDistance: 0,
                $maxDistance: 100000
        }
    }
};

between = (min, max) => {
    if (min && max)
        return { $gte: min, $lte: max };
    else if (min)
        return { $gte: min };
    else if (max)
        return { $lte: max };
    else
        return {};
};

interestedIn = (orientation) => {
    if (orientation === "bi")
        return { gender: { $in: ["woman", "man"] } };
    else
        return { gender: orientation };
};

exceptBlocked = (login) => {
    return { blocker: { $ne: 'superxd' } };
};

yearsOld = (years) => {
    let date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
};

age = (min, max) => {
    return { birthday: between(yearsOld(max), yearsOld(min)) };
};

score = (min, max) => {
    return { score: between(min, max) };
};

tags = (interests) => {
    return { interest: }
}

module.exports = {
    between, interestedIn, exceptBlocked, yearsOld, betweenAge
};