---
layout: post
title: PoC RoR React and CSV
tags: [howto, RoR, React]
---

Has been a while without writing a technical post. Looking at startups I see often a webstack made out of Ruby on Rails (RoR) and React. With the facilities that RoR gives to create a REST API and the popularity of React, I understand the reasons.

To make a small PoC, I decided to import a random CSV to sqlite3 (why bother to use mysql/postgres for this example right?) so I can build a small backend with a service to find information easily.

Let's start bottom up.

### Model creation and importing the data

Download from [this url](https://opendata-ajuntament.barcelona.cat/data/en/dataset/est-padro-domicilis-sexe/resource/39106a1d-de6d-4fb1-a39c-261c472a7c8) the file `2019_domicilis_sexe.csv`. It's open data from Barcelona, identifiying "Homes of the city of Barcelona according to the sex of the people who live in them." It's just an example. Any other CSV file could be good as well.

How to import this data into sqlite3 using Rails, and [seeds](https://edgeguides.rubyonrails.org/active_record_migrations.html#migrations-and-seed-data)?

1. Copy `2019_domicilis_sexe.csv` into `./lib/seeds/` directory (if not exists create it)
2. Modify `./db/seeds.rb` and add the following code

        require 'csv'

        csv_text = File.read(Rails.root.join('lib', 'seeds', '2019_domicilis_sexe.csv'))
        csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
        csv.each do |row|
            sd = SexDatum.new
            sd.year = row['Any']
            sd.district_code = row['Codi_districte']
            sd.district_name = row['Nom_districte']
            sd.neighbourhood_code = row['Codi_barri']
            sd.neighbourhood_name = row['Nom_barri']
            sd.sex = row['Sexe']
            sd.number = row['Nombre']
            
            sd.save
            puts "Entry saved"
        end

3. Let's create the model for this table using:
`rails g model SexData year:integer district_code district_name neighbourhood_code:integer neighbourhood_name sex number:integer`
By default Rails uses strings as type for db fields. Just be explicit on integers on this case.
4. If the model was successfully created, you should see `./app/models/sex_datum.rb` and a migration should be executed: `rake db:migrate` so our database gets updated with the new table/model.
5. Now with the model, the csv data and the seeds, let's import the data: `rake db:seed`
6. To check that the model was created, and the data imported, let's use rails console: `rails c`
7. Once there, let's find one record: `SexDatum.all` Check names, types and values.

### Writing the Controller and handling the routes

Let's create the namespace for the routes.

1. Create the directory `./controllers/api/v1/`
2. And the file `sex_datum_controller.rb` in the same directory containing two methods: one to return all the records (just a test) and another one that will filter records by `district_code` (as an example)

        class Api::V1::SexDatumController < ApplicationController
            def index
                render json: SexDatum.all
            end

            def show
                datum = SexDatum.where district_code:params[:id]
                render json: datum
            end
        end

3. Rewrite the contents (asumming that we have a project from scratch) of `routes.rb` so we can hit two urls
`http://localhost:3000/` and `http://localhost:3000/api/v1/sex_datum/2`. The number 2 is the `district_code` and is just an example.

        Rails.application.routes.draw do
            namespace :api do 
                namespace :v1 do 
                    resources :sex_datum, only: [:index, :show]
                end 
            end 
            root to: 'home#index'
        end


### Writing the View in React.js

1. An empty file should be created in `./app/views/home/index.html.erb`. This file should as a placeholder. The real content will be on `./app/javascript/components/App.jsx` served by webpack. Remember to install the gem and configure the path on `webpacker.yml`. The tile `App.jsx` will have the following content:

        import React from 'react'
        import InputDistrictCode from './InputDistrictCode'

        const App = () => {
            return (
                <div>
                    Hello, I am a react component rendered via rails webpacker
                    <InputDistrictCode />
                </div>
            )
        }
        export default App

3. Now defining `InputDistrictCode.jsx`

        import React, {Component} from 'react';
        import Result from './Result';

        class InputDistrictCode extends Component {

            state = {
                code : '',
                result : [],
            }

            handleClick = (event) => {
                event.preventDefault();
                fetch(`http://localhost:3000/api/v1/sex_datum/${this.state.code}`)
                    .then(response => response.json())
                    .then(data => this.setState( {result : data}))
            }

            handleChange = (event) => {
                const {name, value} = event.target
                this.setState({ [name] : value })
            }

            render() {
                return(
                    <div>
                        <input
                            name='code'
                            onChange={this.handleChange}>
                        </input>
                        <button
                            onClick={this.handleClick}>
                            Find it
                        </button>
                        <Result
                            data={this.state.result} />
                    </div>
                )
            }
        }

        export default InputDistrictCode;

4. And the last component, `Result.jsx`

        import React from 'react'

        const Result = ({data}) => (
            <>
                {data.map( item => (
                    <div key={item.id}>
                    {item.district_name} - {item.id}
                    </div>))}
            </>
        )

        export default Result;

Heading now to `http://localhost:3000/` you should see something like this:

<img src="/images/2019/2019-08-07-form.png" alt="Simple form in React and RoR" class="center" />

Writing an integer in the input field and then hitting the button, some results from the database will be retrieved.

Hope it helps! If you need the code let me know in the comments.
