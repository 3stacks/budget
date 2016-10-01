export default {
    props: [
        'modalTitle',
        'handleCloseRequested'
    ],
    render(h) {
        return (
            <div class="modal-popup">
                <div class="modal-popup--content">
                    <div class="modal-popup--content--meta">
                        <h2 class="modal-popup--content--meta--header">
                            { this.modalTitle }
                        </h2>
                        <button class="modal-popup--content--meta--close" type="button" on-click={this.handleCloseRequested}>
                            &times;
                        </button>
                    </div>
                    <div class="modal-popup--content--transclude--body" slot="slot">
                        { this.$slots.default }
                    </div>
                </div>
                <div class="modal-popup--backdrop" on-click={this.handleCloseRequested}></div>
            </div>
        )
    }
}