class HcodeGrid {
  constructor(configs) {

    configs.listeners = Object.assign({
        afterUpdateClick: (e) => {
          $("#modal-update").modal("show");
        },
        afterDeleteClick: (e) => {
          window.location.reload();
        },
        afterFormCreate: () => {
          window.location.reload();
        },
        afterFormUpdate: () => {
          window.location.reload();
        },
        afterFormCreateError: () => {
          alert('Não foi possível enviar o formulário!')
        },
        afterFormUpdateError: () => {
          alert('Não foi possível enviar o formulário!')
        }

    }, configs.listeners)

		this.options = Object.assign({}, {
			formCreate: "#modal-create form",
			formUpdate: "#modal-update form",
			btnUpdate: "btn-update",
			btnDelete: "btn-delete",
      onUpdateLoad: (form, name, dataSet) => {
        let input = form.querySelector('[name='+name+']')
        if(input) input.value = dataSet[name]
      }
		}, configs)

    this.rows = [...document.querySelectorAll('table tbody tr')]

		this.initForms()

		this.initButtons()
	}

	initForms() {
    this.formCreate = document.querySelector(this.options.formCreate);

    if(this.formCreate) {
      this.formCreate
      .save({
        success: () => {
          this.activateEvent('afterFormCreate')
        },
        failure: () => {
          this.activateEvent('afterFormCreateError')
        }
      })
    }

    this.formUpdate = document.querySelector(this.options.formUpdate);

    if(this.formUpdate) {
      this.formUpdate
      .save({
        success: () => {
          this.activateEvent('afterFormUpdate')
        },
        failure: () => {
          this.activateEvent('afterFormUpdateError')
        }
      })
    }
	}

  activateEvent(name, args) {
    if(typeof this.options.listeners[name] === "function") this.options.listeners[name].apply(this, args)
  }

  getTrData(e) {
    let tr = e.path.find((el) => {
      return el.tagName.toUpperCase() === "TR";
    });

    return JSON.parse(tr.dataset.row);
  }

  btnUpdateClick(e) {
    this.activateEvent('beforeUpdateClick', [e])

    let dataSet = this.getTrData(e)

    for (let name in dataSet) {

      this.options.onUpdateLoad(this.formUpdate, name, dataSet)

    }

    this.activateEvent('afterUpdateClick', [e])
  }
  btnDeleteClick(e) {
    let dataSet = this.getTrData(e)

    if (confirm(eval('`' + this.options.deleteMsg + '`')))
      fetch(eval('`' +this.options.deleteUrl + '`'), {
        method: "DELETE",
      })
        .then((resp) => resp.json())
        .then((data) => {
          this.activateEvent("afterDeleteClick")
        });
  }

	initButtons() {

    this.rows.forEach((row) => {
      [...row.querySelectorAll(".btn")].forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if(e.target.classList.contains(this.options.btnUpdate)) {
            this.btnUpdateClick(e)
          } else if (e.target.classList.contains(this.options.btnDelete)) {
            this.btnDeleteClick(e)
          } else {
            this.activateEvent('buttonClick', [e.target, this.getTrData(e), e])
          }
        })
      })
    });

	}
}
