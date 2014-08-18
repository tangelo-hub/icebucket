
$(function () {
    d3.json('icebucket.json', function (error, data) {
        var svg,
            width = 600,
            padding = 10,
            itemsPerRow = 5,
            size = (width - padding * (itemsPerRow - 1)) / itemsPerRow,
            height = Math.ceil(data.length / itemsPerRow) * (size + padding),
            people,
            personMap = {},
            side = d3.select('#side');

        console.log(data);
        data.forEach(function (d) {
            personMap[d.from] = d;
            d.challengers = [];
        });

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

        people = svg.selectAll('rect')
            .data(data);

        people.enter().append('rect')
            .attr('x', function (d, i) { return (size + padding) * (i % 5); })
            .attr('y', function (d, i) { return (size + padding) * Math.floor(i / 5); })
            .attr('width', size)
            .attr('height', size)
            .style('fill', 'steelblue')
            .style('cursor', 'pointer')
            .on('mouseover', function (d) {
                var challengers, to;
                people.transition(1000)
                    .style('opacity', function (dd) {
                        if (dd.from === d.from || dd.to.indexOf(d.from) >= 0 || dd.challengers.indexOf(d.from) >= 0) {
                            return 1;
                        }
                        return 0.5;
                    })
                    .style('fill', function (dd) {
                        if (dd.from === d.from) {
                            return 'green';
                        } else if (dd.to.indexOf(d.from) >= 0) {
                            return 'brown';
                        } else if (dd.challengers.indexOf(d.from) >= 0) {
                            return 'orange';
                        }
                        return 'steelblue';
                    });
                side.selectAll('*').remove();
                side.append('h3').text(d.from);
                if (d.challengers.length > 0) {
                    challengers = side.append('div');
                    challengers.append('h4').text('Challenged by');
                    challengers.selectAll('div')
                        .data(d.challengers)
                        .enter().append('div')
                        .style('color', 'brown')
                        .text(function (d) { return d; });
                }
                if (d.to.length > 0) {
                    to = side.append('div');
                    to.append('h4').text('Challenged');
                    to.selectAll('div')
                        .data(d.to)
                        .enter().append('div')
                        .style('color', 'orange')
                        .text(function (d) { return d; });
                }
            })
            .on('mouseout', function (d) {
                people.transition(1000)
                    .style('opacity', 1)
                    .style('fill', 'steelblue');
                side.selectAll('*').remove();
            })
            .on('click', function (d) {
                window.open(d.url,'_blank');
            });
    });
});
