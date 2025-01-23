import Dev from '../models/programuotojas.js';
import mongoose from 'mongoose';


export const prog_get = (req, res) => {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    if (!isNaN(lng) && !isNaN(lat)) {
        console.log('Parsed coordinates:', lng, lat);
        Dev.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: 100000
                }
            }
        ])
            .then(devs => {
                console.log('Found developers:', devs);
                res.send(devs);
            })
            .catch(error => {
                console.log('Error:', error);
                res.status(500).send(error.message);
            });
    } else {
        Dev.find()
            .then(devs => {
                console.log('Found developers:', devs);
                res.send(devs);
            })
            .catch(error => {
                console.log('Error:', error);
                res.status(500).send(error.message);
            });
    }
};


export const prog_post = (req, res) => {
    const { vardas, tech, lng, lat } = req.body;

    if (!vardas || !tech || !Array.isArray(tech) || isNaN(lng) || isNaN(lat)) {
        return res.status(400).send('Invalid input data');
    }

    const newDev = new Dev({
        vardas,
        tech,
        location: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
        }
    });

    newDev.save()
        .then(dev => {
            console.log('New developer added:', dev);
            res.status(201).send(dev);
        })
        .catch(error => {
            console.log('Error saving developer:', error);
            res.status(500).send(error.message);
        });

};


export const prog_put = (req, res) => {
    const { vardas, tech, laisvas, lng, lat } = req.body;
    const { id } = req.params;

    if (!vardas || !Array.isArray(tech) || typeof laisvas !== 'boolean' || isNaN(lng) || isNaN(lat)) {
      return res.status(400).send('Invalid input data');
    }
    
    const updatedDev = {
      vardas: vardas,
      tech: tech,
      laisvas: laisvas,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    };

    const objectId = new mongoose.Types.ObjectId(id);

    Dev.updateOne({ _id: objectId }, updatedDev)
      .then(result => {
        if (result.matchedCount > 0) {
          console.log('Developer updated:', result);
          res.status(200).send('Developer successfully updated');
        } else {
          console.log('No developer found to update');
          res.status(404).send('No developer found with the specified ID');
        }
      })
      .catch(error => {
        console.log('Error during update:', error);
        res.status(500).send('Error updating developer: ' + error.message);
      });
  };

export const prog_delete = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('Missing developer ID');
    }

    Dev.deleteOne({ _id: id })
        .then(result => {
            if (result.deletedCount > 0) {
                console.log('Developer deleted:', result);
                res.status(200).send('Developer successfully deleted');
            } else {
                console.log('No developer found to delete');
                res.status(404).send('No developer found with the specified ID');
            }
        })
        .catch(error => {
            console.log('Error during deletion:', error);
            res.status(500).send(error.message);
        });
};