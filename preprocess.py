import csv
import json
import pandas as pd
import math
import copy

with open('us-state-centroids.json') as states:
	states = json.loads(states.read())

	with open('airports.csv') as csvairports, open('airlines.csv') as csvairlines:
		airports = csv.reader(csvairports)
		airlines = csv.reader(csvairlines)
		next(airports,None)
		next(airlines,None)

		airport_dict = {}
		states_initial = {}
		states_dict = {}
		airlines_dict = {}

		for row in airlines:
			airlines_dict[row[0]] = {"ontime" : 0, "delayed" : 0, "diverted" : 0, "cancelled" : 0}

		for row in airports:
			states_dict[row[3]] = copy.deepcopy(airlines_dict)
			airport_dict[row[0]] = row[3]

		states_dict["total"] = copy.deepcopy(airlines_dict)

		airports = csv.reader(csvairports)
		next(airports,None)

		for state in states_dict:
			states_initial[state] = {
				"dep" : copy.deepcopy(states_dict),
				"arr" : copy.deepcopy(states_dict)
			}

		for chunk in pd.read_csv('flights.csv',chunksize=100000):
			for row in chunk.to_dict('records'):
				try:
					org = airport_dict[row['ORIGIN_AIRPORT']]
					dest = airport_dict[row['DESTINATION_AIRPORT']]

					#Destination airport's count if diverted
					#Origin airport's count if cancelled
					#Total is counted for both arrival and departure
					if row['DIVERTED']:
						states_initial[dest]['arr'][org][row['AIRLINE']]['diverted'] += 1
						states_initial[org]['dep'][dest][row['AIRLINE']]['diverted'] += 1
						states_initial[dest]['arr']['total'][row['AIRLINE']]['diverted'] += 1
						states_initial[org]['dep']['total'][row['AIRLINE']]['diverted'] += 1

					elif row['CANCELLED']:
						states_initial[org]['dep'][dest][row['AIRLINE']]['cancelled'] += 1
						states_initial[dest]['arr'][org][row['AIRLINE']]['cancelled'] += 1
						states_initial[org]['dep']['total'][row['AIRLINE']]['cancelled'] += 1
						states_initial[dest]['arr']['total'][row['AIRLINE']]['cancelled'] += 1

					else:
						arrdel = math.floor(row['ARRIVAL_DELAY'])

						if arrdel > 15:
							depdel = math.floor(int(row['DEPARTURE_DELAY']))

							states_initial[dest]['arr'][org][row['AIRLINE']]['delayed'] += 1
							states_initial[dest]['arr']['total'][row['AIRLINE']]['delayed'] += 1

							if depdel > 15:
								states_initial[org]['dep'][dest][row['AIRLINE']]['delayed'] += 1
								states_initial[org]['dep']['total'][row['AIRLINE']]['delayed'] += 1

						else:
							states_initial[org]['dep'][dest][row['AIRLINE']]['ontime'] += 1
							states_initial[dest]['arr'][org][row['AIRLINE']]['ontime'] += 1
							states_initial[org]['dep']['total'][row['AIRLINE']]['ontime'] += 1
							states_initial[dest]['arr']['total'][row['AIRLINE']]['ontime'] += 1

				except Exception as e:
					print(e)
					pass

		state_abbr = {}

		with open('states.csv') as abbr:
			for k, v in csv.reader(abbr):
				state_abbr[k] = v

			for i in range(len(states['features'])):				
				code = state_abbr[states['features'][i]['properties']['name']]
				if states_initial.get(code):
					states['features'][i]['properties']['flights'] = states_initial[code]
					states['features'][i]['properties']['code'] = code
				else:
					states_initial[code] = None

		with open('flights.json','w') as fp:
			json.dump(states,fp)