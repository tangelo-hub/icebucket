
$(function () {
    d3.json('icebucket.json', function (error, data) {
        var svg,
            width = 640,
            padding = 8,
            itemsPerRow = 8,
            size = (width - padding * (itemsPerRow - 1)) / itemsPerRow,
            height = Math.ceil(data.length / itemsPerRow) * (size + padding),
            people,
            personMap = {},
            side = d3.select('#side'),
            peopleRect,
            peopleGroup,
            peopleImage,
            focusColor = '#3182bd',
            challengerColor = '#e6550d',
            toColor = '#31a354';

        console.log(data);
        data.forEach(function (d) {
            personMap[d.from] = d;
            d.date = new Date(d.date);
            d.challengers = [];
        });

        data.sort(function (a, b) { return d3.ascending(a.date, b.date); });

        data.forEach(function (d) {
            d.to.forEach(function (dd) {
                if (personMap[dd]) {
                    personMap[dd].challengers.push(d.from);
                }
            });
        });

        svg = d3.select('#main').append('svg')
            .attr('width', width)
            .attr('height', height);

        people = svg.selectAll('g')
            .data(data);

        peopleGroup = people.enter().append('g');

        peopleRect = peopleGroup.append('rect')
            .attr('x', function (d, i) { return (size + padding) * (i % itemsPerRow); })
            .attr('y', function (d, i) { return (size + padding) * Math.floor(i / itemsPerRow); })
            .attr('width', size)
            .attr('height', size)
            .style('fill', 'white')
            .style('opacity', 0);

        peopleImage = peopleGroup.append('image')
            .attr('x', function (d, i) { return (size + padding) * (i % itemsPerRow) + padding; })
            .attr('y', function (d, i) { return (size + padding) * Math.floor(i / itemsPerRow) + padding; })
            .attr('width', size - 2*padding)
            .attr('height', size - 2*padding)
            .attr('xlink:href', function (d) { return 'img/' + d.from + '.png'; })
            .style('cursor', 'pointer')
            .on('mouseover', function (d) {
                var challengers, to, name;
                peopleRect.transition(1000)
                    .style('opacity', function (dd) {
                        if (dd.from === d.from || dd.to.indexOf(d.from) >= 0 || dd.challengers.indexOf(d.from) >= 0) {
                            return 1;
                        }
                        return 0;
                    })
                    .style('fill', function (dd) {
                        if (dd.from === d.from) {
                            return focusColor;
                        } else if (dd.to.indexOf(d.from) >= 0) {
                            return challengerColor;
                        } else if (dd.challengers.indexOf(d.from) >= 0) {
                            return toColor;
                        }
                        return 'white';
                    });
                side.selectAll('*').remove();
                name = side.append('h3').text(d.from)
                    .style('color', focusColor);
                name.append('br');
                name.append('small').text(d.title);
                if (d.challengers.length > 0) {
                    challengers = side.append('div');
                    challengers.append('h4').text('Challenged by')
                        .style('color', challengerColor);
                    challengers.selectAll('div')
                        .data(d.challengers)
                        .enter().append('div')
                        .text(function (d) { return d; });
                }
                if (d.to.length > 0) {
                    to = side.append('div');
                    to.append('h4').text('Challenged')
                        .style('color', toColor);
                    to.selectAll('div')
                        .data(d.to)
                        .enter().append('div')
                        .text(function (d) { return d; });
                }
            })
            .on('mouseout', function (d) {
                peopleRect.transition(1000)
                    .style('opacity', 0)
                    .style('fill', 'white');
                side.selectAll('*').remove();
            })
            .on('click', function (d) {
                window.open(d.url,'_blank');
            });
        $('#search').keyup(function () {
            var terms = $('#search').val().toLowerCase().split(' ');
            peopleImage.transition(1000).style('opacity', function (d) {
                var i, match = true;
                for (i = 0; i < terms.length; ++i) {
                    if (d.from.toLowerCase().indexOf(terms[i]) < 0 && (d.title === undefined || d.title.toLowerCase().indexOf(terms[i]) < 0)) {
                        match = false;
                        break;
                    }
                }
                return match ? 1 : 0.2;
            });
            console.log(term);
        });
    });
});
