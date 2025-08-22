const PDFDocument = require('pdfkit');
const ics = require('ics');
const fs = require('fs');
const path = require('path');

/**
 * Export itinerary to PDF format
 * @param {Object} itinerary - Itinerary data
 * @param {string} outputPath - Output file path
 * @returns {Object} Export result
 */
async function exportToPDF(itinerary, outputPath = null) {
    try {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Travel Itinerary - ${itinerary.destination}`,
                Author: 'Travel Itinerary App',
                Subject: 'Travel Plan',
                Keywords: 'travel, itinerary, vacation, planning',
                CreationDate: new Date()
            }
        });

        // Set output stream
        const stream = outputPath ? fs.createWriteStream(outputPath) : doc;
        
        if (outputPath) {
            doc.pipe(stream);
        }

        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#2c3e50')
           .text('Travel Itinerary', { align: 'center' });

        doc.moveDown(0.5);
        doc.fontSize(16)
           .font('Helvetica')
           .fillColor('#34495e')
           .text(`${itinerary.destination} - ${itinerary.days} Days`, { align: 'center' });

        doc.moveDown(1);

        // Trip Summary
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#2c3e50')
           .text('Trip Summary');

        doc.moveDown(0.3);
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#34495e');

        const summaryData = [
            ['Destination:', itinerary.destination],
            ['Duration:', `${itinerary.days} days`],
            ['Interests:', itinerary.interests.join(', ')],
            ['Total Cost:', itinerary.totalCost],
            ['Highlights:', itinerary.highlights.join(', ')]
        ];

        summaryData.forEach(([label, value]) => {
            doc.text(`${label} ${value}`);
        });

        doc.moveDown(1);

        // Daily Plans
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#2c3e50')
           .text('Daily Itinerary');

        itinerary.dailyPlans.forEach((day, index) => {
            doc.moveDown(0.5);
            doc.fontSize(13)
               .font('Helvetica-Bold')
               .fillColor('#e74c3c')
               .text(`Day ${day.day}: ${day.theme}`);

            doc.moveDown(0.3);
            doc.fontSize(12)
               .font('Helvetica')
               .fillColor('#34495e');

            // Morning Activities
            if (day.activities.morning && day.activities.morning.length > 0) {
                doc.font('Helvetica-Bold').text('🌅 Morning:');
                day.activities.morning.forEach(activity => {
                    doc.font('Helvetica').text(`  • ${activity}`);
                });
                doc.moveDown(0.2);
            }

            // Afternoon Activities
            if (day.activities.afternoon && day.activities.afternoon.length > 0) {
                doc.font('Helvetica-Bold').text('☀️ Afternoon:');
                day.activities.afternoon.forEach(activity => {
                    doc.font('Helvetica').text(`  • ${activity}`);
                });
                doc.moveDown(0.2);
            }

            // Evening Activities
            if (day.activities.evening && day.activities.evening.length > 0) {
                doc.font('Helvetica-Bold').text('🌙 Evening:');
                day.activities.evening.forEach(activity => {
                    doc.font('Helvetica').text(`  • ${activity}`);
                });
                doc.moveDown(0.2);
            }

            // Restaurants
            if (day.restaurants) {
                doc.font('Helvetica-Bold').text('🍽️ Dining:');
                if (day.restaurants.breakfast) {
                    doc.font('Helvetica').text(`  Breakfast: ${day.restaurants.breakfast.join(', ')}`);
                }
                if (day.restaurants.lunch) {
                    doc.font('Helvetica').text(`  Lunch: ${day.restaurants.lunch.join(', ')}`);
                }
                if (day.restaurants.dinner) {
                    doc.font('Helvetica').text(`  Dinner: ${day.restaurants.dinner.join(', ')}`);
                }
                doc.moveDown(0.2);
            }

            // Accommodation & Transport
            if (day.accommodation) {
                doc.font('Helvetica-Bold').text('🏨 Accommodation:');
                doc.font('Helvetica').text(`  ${day.accommodation.join(', ')}`);
                doc.moveDown(0.2);
            }

            if (day.transport) {
                doc.font('Helvetica-Bold').text('🚗 Transport:');
                doc.font('Helvetica').text(`  ${day.transport.join(', ')}`);
                doc.moveDown(0.2);
            }

            doc.moveDown(0.5);
        });

        // Local Tips
        if (itinerary.localTips && itinerary.localTips.length > 0) {
            doc.addPage();
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .fillColor('#2c3e50')
               .text('Local Tips & Recommendations');

            doc.moveDown(0.5);
            doc.fontSize(12)
               .font('Helvetica')
               .fillColor('#34495e');

            itinerary.localTips.forEach(tip => {
                doc.text(`• ${tip}`);
                doc.moveDown(0.2);
            });
        }

        // Footer
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#7f8c8d')
           .text(`Generated on ${new Date().toLocaleDateString()} by Travel Itinerary App`, { align: 'center' });

        // Finalize PDF
        doc.end();

        return new Promise((resolve, reject) => {
            if (outputPath) {
                stream.on('finish', () => {
                    resolve({
                        success: true,
                        message: 'PDF exported successfully',
                        filePath: outputPath,
                        timestamp: new Date().toISOString()
                    });
                });
                stream.on('error', reject);
            } else {
                resolve({
                    success: true,
                    message: 'PDF generated successfully',
                    timestamp: new Date().toISOString()
                });
            }
        });

    } catch (error) {
        console.error('PDF export error:', error);
        throw new Error('Failed to export PDF');
    }
}

/**
 * Export itinerary to Google Calendar format (ICS)
 * @param {Object} itinerary - Itinerary data
 * @param {string} outputPath - Output file path
 * @returns {Object} Export result
 */
async function exportToCalendar(itinerary, outputPath = null) {
    try {
        const events = [];
        const startDate = new Date();
        startDate.setHours(9, 0, 0, 0); // Start at 9 AM

        itinerary.dailyPlans.forEach((day, dayIndex) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + dayIndex);

            // Morning activities
            if (day.activities.morning && day.activities.morning.length > 0) {
                day.activities.morning.forEach((activity, index) => {
                    const eventStart = new Date(currentDate);
                    eventStart.setHours(9 + (index * 2), 0, 0, 0);
                    
                    const eventEnd = new Date(eventStart);
                    eventEnd.setHours(eventStart.getHours() + 2);

                    events.push({
                        start: [
                            eventStart.getFullYear(),
                            eventStart.getMonth() + 1,
                            eventStart.getDate(),
                            eventStart.getHours(),
                            eventStart.getMinutes()
                        ],
                        end: [
                            eventEnd.getFullYear(),
                            eventEnd.getMonth() + 1,
                            eventEnd.getDate(),
                            eventEnd.getHours(),
                            eventEnd.getMinutes()
                        ],
                        title: `🌅 ${activity}`,
                        description: `Day ${day.day} - ${day.theme}`,
                        location: itinerary.destination,
                        categories: ['travel', 'morning']
                    });
                });
            }

            // Afternoon activities
            if (day.activities.afternoon && day.activities.afternoon.length > 0) {
                day.activities.afternoon.forEach((activity, index) => {
                    const eventStart = new Date(currentDate);
                    eventStart.setHours(14 + (index * 2), 0, 0, 0);
                    
                    const eventEnd = new Date(eventStart);
                    eventEnd.setHours(eventStart.getHours() + 2);

                    events.push({
                        start: [
                            eventStart.getFullYear(),
                            eventStart.getMonth() + 1,
                            eventStart.getDate(),
                            eventStart.getHours(),
                            eventStart.getMinutes()
                        ],
                        end: [
                            eventEnd.getFullYear(),
                            eventEnd.getMonth() + 1,
                            eventEnd.getDate(),
                            eventEnd.getHours(),
                            eventEnd.getMinutes()
                        ],
                        title: `☀️ ${activity}`,
                        description: `Day ${day.day} - ${day.theme}`,
                        location: itinerary.destination,
                        categories: ['travel', 'afternoon']
                    });
                });
            }

            // Evening activities
            if (day.activities.evening && day.activities.evening.length > 0) {
                day.activities.evening.forEach((activity, index) => {
                    const eventStart = new Date(currentDate);
                    eventStart.setHours(18 + (index * 1.5), 0, 0, 0);
                    
                    const eventEnd = new Date(eventStart);
                    eventEnd.setHours(eventStart.getHours() + 1.5);

                    events.push({
                        start: [
                            eventStart.getFullYear(),
                            eventStart.getMonth() + 1,
                            eventStart.getDate(),
                            eventStart.getHours(),
                            eventStart.getMinutes()
                        ],
                        end: [
                            eventEnd.getFullYear(),
                            eventEnd.getMonth() + 1,
                            eventEnd.getDate(),
                            eventEnd.getHours(),
                            eventEnd.getMinutes()
                        ],
                        title: `🌙 ${activity}`,
                        description: `Day ${day.day} - ${day.theme}`,
                        location: itinerary.destination,
                        categories: ['travel', 'evening']
                    });
                });
            }

            // Dining events
            if (day.restaurants) {
                const mealTimes = [
                    { time: 8, meal: 'breakfast', emoji: '🍳' },
                    { time: 13, meal: 'lunch', emoji: '🍽️' },
                    { time: 20, meal: 'dinner', emoji: '🍴' }
                ];

                mealTimes.forEach(({ time, meal, emoji }) => {
                    if (day.restaurants[meal] && day.restaurants[meal].length > 0) {
                        const eventStart = new Date(currentDate);
                        eventStart.setHours(time, 0, 0, 0);
                        
                        const eventEnd = new Date(eventStart);
                        eventEnd.setHours(eventStart.getHours() + 1);

                        events.push({
                            start: [
                                eventStart.getFullYear(),
                                eventStart.getMonth() + 1,
                                eventStart.getDate(),
                                eventStart.getHours(),
                                eventStart.getMinutes()
                            ],
                            end: [
                                eventEnd.getFullYear(),
                                eventEnd.getMonth() + 1,
                                eventEnd.getDate(),
                                eventEnd.getHours(),
                                eventEnd.getMinutes()
                            ],
                            title: `${emoji} ${meal.charAt(0).toUpperCase() + meal.slice(1)}`,
                            description: `${day.restaurants[meal].join(', ')}`,
                            location: itinerary.destination,
                            categories: ['travel', 'dining']
                        });
                    }
                });
            }
        });

        // Generate ICS file
        const { error, value } = ics.createEvents(events);
        
        if (error) {
            throw new Error(`ICS generation error: ${error}`);
        }

        // Write to file or return content
        if (outputPath) {
            fs.writeFileSync(outputPath, value);
            return {
                success: true,
                message: 'Calendar file exported successfully',
                filePath: outputPath,
                eventsCount: events.length,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: true,
                message: 'Calendar file generated successfully',
                content: value,
                eventsCount: events.length,
                timestamp: new Date().toISOString()
            };
        }

    } catch (error) {
        console.error('Calendar export error:', error);
        throw new Error('Failed to export calendar');
    }
}

/**
 * Export itinerary to JSON format
 * @param {Object} itinerary - Itinerary data
 * @param {string} outputPath - Output file path
 * @returns {Object} Export result
 */
async function exportToJSON(itinerary, outputPath = null) {
    try {
        const exportData = {
            ...itinerary,
            exportedAt: new Date().toISOString(),
            version: '1.0',
            app: 'Travel Itinerary App'
        };

        if (outputPath) {
            fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
            return {
                success: true,
                message: 'JSON file exported successfully',
                filePath: outputPath,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: true,
                message: 'JSON data generated successfully',
                data: exportData,
                timestamp: new Date().toISOString()
            };
        }

    } catch (error) {
        console.error('JSON export error:', error);
        throw new Error('Failed to export JSON');
    }
}

/**
 * Export itinerary to plain text format
 * @param {Object} itinerary - Itinerary data
 * @param {string} outputPath - Output file path
 * @returns {Object} Export result
 */
async function exportToText(itinerary, outputPath = null) {
    try {
        let textContent = '';

        // Header
        textContent += 'TRAVEL ITINERARY\n';
        textContent += '='.repeat(50) + '\n\n';
        textContent += `Destination: ${itinerary.destination}\n`;
        textContent += `Duration: ${itinerary.days} days\n`;
        textContent += `Interests: ${itinerary.interests.join(', ')}\n`;
        textContent += `Total Cost: ${itinerary.totalCost}\n\n`;

        // Daily plans
        textContent += 'DAILY ITINERARY\n';
        textContent += '-'.repeat(30) + '\n\n';

        itinerary.dailyPlans.forEach(day => {
            textContent += `Day ${day.day}: ${day.theme}\n`;
            textContent += '='.repeat(30) + '\n\n';

            if (day.activities.morning && day.activities.morning.length > 0) {
                textContent += 'MORNING:\n';
                day.activities.morning.forEach(activity => {
                    textContent += `  • ${activity}\n`;
                });
                textContent += '\n';
            }

            if (day.activities.afternoon && day.activities.afternoon.length > 0) {
                textContent += 'AFTERNOON:\n';
                day.activities.afternoon.forEach(activity => {
                    textContent += `  • ${activity}\n`;
                });
                textContent += '\n';
            }

            if (day.activities.evening && day.activities.evening.length > 0) {
                textContent += 'EVENING:\n';
                day.activities.evening.forEach(activity => {
                    textContent += `  • ${activity}\n`;
                });
                textContent += '\n';
            }

            if (day.restaurants) {
                textContent += 'DINING:\n';
                if (day.restaurants.breakfast) {
                    textContent += `  Breakfast: ${day.restaurants.breakfast.join(', ')}\n`;
                }
                if (day.restaurants.lunch) {
                    textContent += `  Lunch: ${day.restaurants.lunch.join(', ')}\n`;
                }
                if (day.restaurants.dinner) {
                    textContent += `  Dinner: ${day.restaurants.dinner.join(', ')}\n`;
                }
                textContent += '\n';
            }

            textContent += '\n';
        });

        // Local tips
        if (itinerary.localTips && itinerary.localTips.length > 0) {
            textContent += 'LOCAL TIPS & RECOMMENDATIONS\n';
            textContent += '-'.repeat(40) + '\n\n';
            itinerary.localTips.forEach(tip => {
                textContent += `• ${tip}\n`;
            });
            textContent += '\n';
        }

        // Footer
        textContent += 'Generated by Travel Itinerary App\n';
        textContent += `Exported on: ${new Date().toLocaleDateString()}\n`;

        if (outputPath) {
            fs.writeFileSync(outputPath, textContent);
            return {
                success: true,
                message: 'Text file exported successfully',
                filePath: outputPath,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: true,
                message: 'Text content generated successfully',
                content: textContent,
                timestamp: new Date().toISOString()
            };
        }

    } catch (error) {
        console.error('Text export error:', error);
        throw new Error('Failed to export text');
    }
}

module.exports = {
    exportToPDF,
    exportToCalendar,
    exportToJSON,
    exportToText
};
